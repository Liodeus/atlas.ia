import a from './courseEditorial1.json' with {type:'json'};
import b from './courseEditorial2.json' with {type:'json'};
import c from './courseEditorial3.json' with {type:'json'};
import d from './courseEditorial4.json' with {type:'json'};

// Les quatre fichiers gardent les identifiants du glossaire inchangés.
export const courseEditorial={...a,...b,...c,...d};
