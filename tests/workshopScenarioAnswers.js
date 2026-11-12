// Réponses aux variantes des scénarios exercés dans les parcours navigateur.
export const variantAnswers={
 'choisir-les-fichiers':{'next-files-revision':'manifest','next-files-template':'keep-variant','next-files-validation':'image-test'},
 'budget-memoire':{'next-memory-total':15.4,'next-memory-adaptation':'more-memory'},
 'fidelite-et-qualite':{'next-quality-pilot':'y','next-quality-generalisation':'observed','next-quality-kl':'protocol'},
 'performance-durable':{'next-thermal-hypothesis':'power','next-thermal-experiment':'controlled','next-thermal-energy':216},
 'changer-environnement':{'next-migration-startup':'limited','next-migration-limits':['memory','latency'],'next-migration-container':'exposure','next-migration-wording':'criteria'},
 'masquer-attention':{'next-direct':['t3','t4','t5'],'next-path':'layers','next-guarantee':'possible'},
 'router-experts':{'next-routing':'new','next-distinct':22,'next-cost':'remeasure'},
 'composer-contexte':{'next-plan':'full-history','next-margin':1900},
 'comparer-filtres':{'next-precision':44.4,'next-interpretation':'both'}
};
export async function answerVariant(page,id){
 for(const [key,value] of Object.entries(variantAnswers[id]||{})){
  if(typeof value==='number')await page.locator('#workshop-answer-'+key).fill(String(value));
  else for(const choice of [value].flat())await page.locator(`input[name="${key}"][value="${choice}"]`).check();
 }
}
