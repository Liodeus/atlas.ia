import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { priorityContent } from '../src/priorityContent.js';

const themes = JSON.parse(await readFile(new URL('../src/glossary.json', import.meta.url), 'utf8'));
const priorityIds = themes.flatMap(theme => theme.entries).filter(entry => entry.priority).map(entry => entry.id);

test('priority content covers exactly the 82 priority notions', () => {
  assert.equal(priorityIds.length, 82);
  assert.deepEqual(Object.keys(priorityContent).sort(), [...priorityIds].sort());
});

test('each priority notion has three distinct, nonempty teaching fields without em dashes', () => {
  const fields = ['explanation', 'example', 'misconception'];
  for (const [id, content] of Object.entries(priorityContent)) {
    assert.deepEqual(Object.keys(content).sort(), [...fields].sort(), id);
    const values = fields.map(field => content[field]);
    for (const value of values) {
      assert.equal(typeof value, 'string', id);
      assert.ok(value.trim().length > 0, id);
      assert.ok(!value.includes('\u2014'), id);
    }
    assert.equal(new Set(values).size, fields.length, id);
    assert.ok(content.example.startsWith('Exemple illustratif :'), id);
  }
});
