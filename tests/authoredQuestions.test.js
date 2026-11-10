import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { authoredQuestions } from '../src/allQuestions.js';
import themes from '../src/themes.js';
import { buildQuiz, grade } from '../src/core.js';

const distinctions = JSON.parse(await readFile(new URL('../src/distinctions.json', import.meta.url), 'utf8'));
const levels = ['debutant', 'intermediaire', 'avance'];
const entries = themes.flatMap(theme => theme.entries);
const priority = entries.filter(entry => entry.priority);

test('authored bank contains 15 questions per theme with stable unique IDs and prompts', () => {
  assert.equal(authoredQuestions.length, themes.length*15);
  assert.equal(new Set(authoredQuestions.map(q => q.id)).size, themes.length*15);
  assert.equal(new Set(authoredQuestions.map(q => q.prompt)).size, themes.length*15);
  assert.equal(themes.length, 18);
  for (const theme of themes) {
    const questions = authoredQuestions.filter(q => q.theme === theme.id);
    assert.equal(questions.length, 15, `theme ${theme.id}`);
    assert.deepEqual(questions.map(q => q.id), Array.from({ length: 15 }, (_, i) => `author-${theme.id}-${i + 1}`));
    for (const [index, question] of questions.entries()) {
      assert.equal(question.level, levels[Math.floor(index / 5)], `${question.id}: stable level`);
    }
    for (const level of levels) {
      assert.equal(questions.filter(q => q.level === level).length, 5, `theme ${theme.id}, ${level}`);
    }
  }
});

test('every priority notion has a question and every linked concept belongs to its theme', () => {
  assert.equal(priority.length, 82);
  const covered = new Set(authoredQuestions.map(q => q.concept));
  assert.deepEqual(priority.filter(entry => !covered.has(entry.id)).map(entry => entry.id), []);
  for (const q of authoredQuestions) {
    assert.ok(entries.some(entry => entry.id === q.concept && entry.theme === q.theme), q.id);
  }
  assert.ok(authoredQuestions.some(q => q.level === 'avance' && priority.some(entry => entry.id === q.concept)));
});

test('question fields and answer structures match the quiz contract', () => {
  for (const q of authoredQuestions) {
    for (const field of ['id', 'level', 'prompt', 'explanation', 'concept']) {
      assert.equal(typeof q[field], 'string', `${q.id}: ${field}`);
      assert.ok(q[field].trim(), `${q.id}: empty ${field}`);
    }
    assert.ok(levels.includes(q.level), q.id);
    assert.ok(['choice', 'number', 'order', 'matching'].includes(q.kind), q.id);
    assert.ok(!JSON.stringify(q).includes('\u2014'), q.id);
    assert.ok(!q.prompt.startsWith('Quelle définition correspond'), q.id);
    if (q.kind === 'choice') {
      assert.equal(typeof q.answer, 'string', q.id);
      assert.ok(Array.isArray(q.options), q.id);
      assert.ok([2, 4].includes(q.options.length), q.id);
      assert.ok(q.options.every(option => typeof option === 'string' && option.trim()), q.id);
      assert.equal(new Set(q.options).size, q.options.length, q.id);
      assert.equal(q.options.filter(option => option === q.answer).length, 1, q.id);
      if (q.options.length === 2) assert.deepEqual([...q.options].sort(), ['Faux', 'Vrai'], q.id);
    } else if (q.kind === 'number') {
      assert.equal(typeof q.answer, 'number', q.id);
      assert.ok(Number.isFinite(q.answer), q.id);
      if (q.tolerance !== undefined) assert.ok(Number.isFinite(q.tolerance) && q.tolerance >= 0, q.id);
    } else {
      assert.ok(Array.isArray(q.answer) && q.answer.length >= 2, q.id);
      assert.ok(q.answer.every(value => typeof value === 'string' && value.trim()), q.id);
      assert.equal(new Set(q.answer).size, q.answer.length, q.id);
      if (q.kind === 'matching') {
        assert.ok(Array.isArray(q.labels), q.id);
        assert.equal(q.labels.length, q.answer.length, q.id);
        assert.ok(q.labels.every(label => typeof label === 'string' && label.trim()), q.id);
        assert.equal(new Set(q.labels).size, q.labels.length, q.id);
      }
    }
  }
});

test('each theme offers QCM, true/false, order and matching without a numeric quota', () => {
  for (const theme of themes) {
    const questions = authoredQuestions.filter(q => q.theme === theme.id);
    for (const kind of ['order', 'matching']) assert.ok(questions.some(q => q.kind === kind), `${theme.id}: ${kind}`);
    assert.ok(questions.some(q => q.kind === 'choice' && q.options.length === 4), `QCM ${theme.id}`);
    assert.ok(questions.some(q => q.kind === 'choice' && q.options.length === 2), `V/F ${theme.id}`);
  }
});

test('numeric questions are few, contextualized and include all quantities and units', () => {
  // Editorial cases deliberately check the assumptions as well as the arithmetic.
  // Adding a numeric item requires documenting its technical purpose here.
  const cases = {
    'author-5-5': { answer: 4096 - 3072, patterns: [/4096 Tokens/, /3072 Tokens/, /entrée et sortie/, /incluant/, /maximum/] },
    'author-8-2': { answer: 8 * 4 / 16, patterns: [/Quantization/, /16 bits/, /4 bits/, /8 Go/, /même nombre de Weights/, /métadonnées/, /Go/] },
    'author-8-4': { answer: 40 / 2, patterns: [/40 Tokens/, /2 secondes/, /après le premier Token/, /Tokens per Second/] },
    'author-16-5': { answer: 2 * 1 + 1 * 3, patterns: [/2000 Tokens/, /1000 Tokens/, /1 €/, /3 €/, /entrée/, /sortie/, /autres frais/] },
  };
  const numeric = authoredQuestions.filter(q => q.kind === 'number');
  assert.ok(numeric.length >= 1 && numeric.length <= 6, 'keep calculations exceptional');
  assert.deepEqual(numeric.map(q => q.id).sort(), Object.keys(cases).sort());
  for (const q of numeric) {
    const expected = cases[q.id];
    assert.equal(q.answer, expected.answer, q.id);
    for (const pattern of expected.patterns) assert.match(q.prompt, pattern, q.id);
  }
  assert.ok(numeric.some(q => q.concept === 'notion-222' && /Quantization/.test(q.prompt)));
});

test('counting template fields and artificial numeric quotas cannot return', () => {
  const rejectedCounts = ['author-1-9', 'author-2-2', 'author-3-4', 'author-4-4', 'author-6-4', 'author-7-4', 'author-9-5', 'author-10-5', 'author-11-5', 'author-12-3', 'author-13-5', 'author-14-5', 'author-15-4'];
  for (const id of rejectedCounts) {
    const q = authoredQuestions.find(question => question.id === id);
    assert.ok(q, id);
    assert.equal(q.kind, 'choice', id);
  }
  for (const q of authoredQuestions) {
    assert.doesNotMatch(q.prompt, /champs manquants\s*=|combien.*champs|3 champs obligatoires/i, q.id);
  }
  const template = authoredQuestions.find(q => q.id === 'author-10-5');
  assert.equal(template.concept, 'notion-318');
  assert.match(template.prompt, /Prompt Template/);
});

test('the GPU memory question names the hardware and its VRAM clearly', () => {
  const question = authoredQuestions.find(q => q.id === 'author-15-2');
  assert.match(question.prompt, /\bGPU\b/);
  assert.match(question.answer, /\bVRAM\b/);
});

test('GQA question compares related attention mechanisms with an explicit grouping', () => {
  const question = authoredQuestions.find(q => q.id === 'author-3-8');
  assert.match(question.prompt, /deux groupes/i);
  assert.match(question.answer, /GQA/);
  assert.ok(question.options.some(option => /\bMQA\b/.test(option)));
  assert.ok(question.options.some(option => /\bMHA\b/.test(option)));
});

test('all authored correct answers are accepted and altered answers are rejected', () => {
  for (const q of authoredQuestions) {
    const answer = q.kind === 'number' ? String(q.answer).replace('.', ',') : q.answer;
    assert.equal(grade(q, answer), true, q.id);
    const wrong = q.kind === 'choice' ? q.options.find(value => value !== q.answer)
      : q.kind === 'number' ? String(q.answer + (q.tolerance || 0) + 1)
        : [...q.answer].reverse();
    assert.equal(grade(q, wrong), false, q.id);
    if (q.kind === 'number') assert.equal(grade(q, ''), false, q.id);
  }
});

test('every theme and level filter can form its complete five-question session', () => {
  for (const theme of themes) for (const level of levels) {
    const quiz = buildQuiz(authoredQuestions, [theme.id], 20, level);
    assert.equal(quiz.length, 5);
    assert.ok(quiz.every(q => q.theme === theme.id && q.level === level));
    assert.equal(new Set(quiz.map(q => q.id)).size, 5);
  }
});

// Explicit editorial map: each of the twelve existing distinctions has an applied question.
test('all twelve distinctions are represented by targeted authored questions', () => {
  const coverage = [
    ['author-3-6', /Sparse attention/i, /Sparse MoE/i],
    ['author-3-9', /FlashAttention/, /connexions/],
    ['author-3-12', /PagedAttention/, /FlashAttention/],
    ['author-3-8', /GQA/, /MoE/],
    ['author-9-1', /RAG/, /Fine-tuning/],
    ['author-7-1', /Fine-tuning/, /Prompt/],
    ['author-7-8', /Quantization/, /Knowledge Distillation/],
    ['author-16-1', /Weights/, /Open Source/],
    ['author-5-3', /Context Window/, /sessions/],
    ['author-13-6', /Jailbreak/, /Prompt Injection/],
    ['author-12-4', /Hallucination/, /intention consciente/],
    ['author-12-1', /Benchmark/, /universelle/],
  ];
  assert.ok(distinctions.length >= coverage.length);
  assert.equal(coverage.length, 12);
  for (const [id, ...patterns] of coverage) {
    const q = authoredQuestions.find(question => question.id === id);
    assert.ok(q, id);
    for (const pattern of patterns) assert.match(JSON.stringify(q), pattern, id);
  }
});
