import {priorityContent} from './priorityContent.js';
import theme01 from './notionDetails/theme-01.json' with {type:'json'};
import theme02 from './notionDetails/theme-02.json' with {type:'json'};
import theme03 from './notionDetails/theme-03.json' with {type:'json'};
import theme04 from './notionDetails/theme-04.json' with {type:'json'};
import theme05 from './notionDetails/theme-05.json' with {type:'json'};
import theme06 from './notionDetails/theme-06.json' with {type:'json'};
import theme07 from './notionDetails/theme-07.json' with {type:'json'};
import theme08 from './notionDetails/theme-08.json' with {type:'json'};
import theme09 from './notionDetails/theme-09.json' with {type:'json'};
import theme10 from './notionDetails/theme-10.json' with {type:'json'};
import theme11 from './notionDetails/theme-11.json' with {type:'json'};
import theme12 from './notionDetails/theme-12.json' with {type:'json'};
import theme13 from './notionDetails/theme-13.json' with {type:'json'};
import theme14 from './notionDetails/theme-14.json' with {type:'json'};
import theme15 from './notionDetails/theme-15.json' with {type:'json'};
import theme16 from './notionDetails/theme-16.json' with {type:'json'};
import theme17 from './notionDetails/theme-17.json' with {type:'json'};
import theme18 from './notionDetails/theme-18.json' with {type:'json'};

// Les 82 fiches prioritaires conservent leur texte ; les compléments couvrent les autres notions.
// Ces données sont chargées uniquement à l’ouverture d’un cours ou d’une fiche.
export const supplementalContent = Object.assign({},theme01,theme02,theme03,theme04,theme05,theme06,theme07,theme08,theme09,theme10,theme11,theme12,theme13,theme14,theme15,theme16,theme17,theme18);
export const notionContent = {...priorityContent,...supplementalContent};
