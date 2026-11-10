import a from './courseEditorial1.json' with {type:'json'};
import b from './courseEditorial2.json' with {type:'json'};
import c from './courseEditorial3.json' with {type:'json'};
import {harnessEditorial} from './extensionHarness.js';
import {familyEditorial} from './extensionFamilies.js';

// Les trois fichiers gardent les identifiants du glossaire inchangés.
export const courseEditorial={...a,...b,...c,17:harnessEditorial,18:familyEditorial};
