export function createIdAssigner(themes) {
 const known=new Map(), used=new Set(); let highest=0;
 for(const theme of themes)for(const entry of theme.entries){
  const key=`${theme.id}\0${entry.name}`;
  if(known.has(key)||used.has(entry.id))throw Error('Identifiant ou notion en double dans le glossaire existant');
  known.set(key,entry.id);used.add(entry.id);
  const match=/^notion-(\d+)$/.exec(entry.id);if(match)highest=Math.max(highest,Number(match[1]));
 }
 const assigned=new Set();
 return (theme,name)=>{
  const key=`${theme}\0${name}`;
  if(assigned.has(key))throw Error('Notion dupliquée dans le thème : '+name);
  assigned.add(key);
  const old=known.get(key);if(old)return old;
  let id;do{id=`notion-${++highest}`}while(used.has(id));used.add(id);return id;
 };
}
