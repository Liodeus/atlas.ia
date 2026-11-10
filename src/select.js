export function nextSelectIndex(key,current,count){
 if(!count)return -1;
 if(key==='Home')return 0;
 if(key==='End')return count-1;
 if(key==='ArrowDown')return (current+1+count)%count;
 if(key==='ArrowUp')return (current-1+count)%count;
 return current;
}
