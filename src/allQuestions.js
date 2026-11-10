import {authoredQuestions as originalQuestions} from './authoredQuestions.js';
import {harnessQuestions} from './extensionHarness.js';
import {familyQuestions} from './extensionFamilies.js';

export const authoredQuestions=[...originalQuestions,...harnessQuestions,...familyQuestions];
