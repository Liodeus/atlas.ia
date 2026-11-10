// Noms affichés en anglais, sans modifier les identifiants ni le glossaire source.
const names={
 'notion-1':'AI (Artificial Intelligence)',
 'notion-35':'Parameter / Weight',
 'notion-36':'Bias',
 'notion-37':'Layer',
 'notion-150':'Pretraining',
 'notion-155':'Policy',
 'notion-221':'Inference',
 'notion-222':'Quantization',
 'notion-364':'Recall',
 'notion-390':'Least Privilege',
 'notion-418':'Multimodality'
};
export function conceptName(entry){return entry?names[entry.id]||entry.name:''}
