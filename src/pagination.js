export function paginate(values,page,size=24){
 const total=values.length,limit=Math.max(1,Math.floor(size)||24),pages=Math.max(1,Math.ceil(total/limit));
 const current=Math.max(1,Math.min(pages,Number.isFinite(Number(page))?Math.floor(Number(page)):1));
 const start=(current-1)*limit,items=values.slice(start,start+limit);
 return {items,total,pages,page:current,first:total?start+1:0,last:Math.min(start+limit,total)};
}
