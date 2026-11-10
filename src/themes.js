import baseThemes from './glossary.json' with {type:'json'};
import {harnessTheme} from './extensionHarness.js';
import {familyTheme} from './extensionFamilies.js';

// Les ajouts gardent leurs identifiants et restent indépendants de l’import du glossaire source.
export default [...baseThemes,harnessTheme,familyTheme];
