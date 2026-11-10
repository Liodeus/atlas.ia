import {basename} from 'node:path';

// L’entrée et les préchargements de modules sont tous téléchargés dès l’arrivée.
export function initialJavaScriptFiles(html){
 const result=new Set();
 for(const match of html.matchAll(/<(?:script|link)\b[^>]*>/gi)){
  const tag=match[0];
  if(!/^<script\b/i.test(tag)&&!/(?:^|\s)rel=["']modulepreload["']/i.test(tag))continue;
  const url=tag.match(/(?:src|href)=["']([^"']+\.js)(?:\?[^"']*)?["']/i)?.[1];
  if(url)result.add(basename(url));
 }
 return [...result];
}
