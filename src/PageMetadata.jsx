import {useLayoutEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {pageMetadata} from './metadata.js';

export function PageMetadata(){
 const {pathname,search}=useLocation();
 useLayoutEffect(()=>{
  const data=pageMetadata(pathname,search,__ATLAS_SITE_URL__);
  document.title=data.title;
  const set=(key,value,property=false)=>{
   const attr=property?'property':'name';let node=document.head.querySelector(`meta[${attr}="${key}"]`);
   if(!value){node?.remove();return}
   if(!node){node=document.createElement('meta');node.setAttribute(attr,key);document.head.append(node)}
   node.setAttribute('content',value);
  };
  set('description',data.description);set('robots',data.noindex?'noindex, follow':'index, follow');
  for(const [key,value] of Object.entries({title:data.title,description:data.description,url:data.url,image:data.image,type:['notion','course'].includes(data.kind)?'article':'website',locale:'fr_FR',site_name:'Atlas IA','image:width':'1200','image:height':'630','image:alt':'Atlas IA, comprendre l’intelligence artificielle'}))set('og:'+key,value,true);
  for(const [key,value] of Object.entries({card:'summary_large_image',title:data.title,description:data.description,image:data.image,'image:alt':'Atlas IA, comprendre l’intelligence artificielle'}))set('twitter:'+key,value);
  let canonical=document.head.querySelector('link[rel="canonical"]');
  if(data.url){if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical)}canonical.href=data.url}else canonical?.remove();
 },[pathname,search]);
 return null;
}
