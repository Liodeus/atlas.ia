import React, {useEffect,useId,useRef,useState} from 'react';
import {Check, ChevronDown} from 'lucide-react';
import {nextSelectIndex} from './select.js';

export function FancySelect({label,value,onChange,options,placeholder='Choisir',disabled=false}){
 const id=useId(),root=useRef(null),button=useRef(null);
 const [open,setOpen]=useState(false),[active,setActive]=useState(0);
 const selected=options.findIndex(o=>o.value===value);
 useEffect(()=>{
  if(!open)return;
  const outside=e=>{if(root.current&&!root.current.contains(e.target))setOpen(false)};
  document.addEventListener('pointerdown',outside);
  return ()=>document.removeEventListener('pointerdown',outside);
 },[open]);
 useEffect(()=>{if(open)document.getElementById(`${id}-option-${active}`)?.scrollIntoView({block:'nearest'})},[open,active,id]);
 const choose=i=>{if(i>=0&&i<options.length){onChange(options[i].value);setOpen(false);button.current?.focus()}};
 const keyDown=e=>{
  if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
   e.preventDefault();
   if(!open){setActive(selected<0?0:selected);setOpen(true)}
   else setActive(nextSelectIndex(e.key,active,options.length));
  } else if(e.key==='Enter'||e.key===' '){
   e.preventDefault();if(open)choose(active);else{setActive(selected<0?0:selected);setOpen(true)}
  } else if(e.key==='Escape'&&open){e.preventDefault();setOpen(false)}
  else if(e.key==='Tab')setOpen(false);
 };
 return <div className={'fancy-select '+(open?'is-open ':'')+(disabled?'is-disabled':'')} ref={root}>
  <button type="button" ref={button} role="combobox" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={id+'-list'} aria-activedescendant={open?`${id}-option-${active}`:undefined} disabled={disabled} onKeyDown={keyDown} onClick={()=>{if(!open)setActive(selected<0?0:selected);setOpen(!open)}}>
   <span className={selected<0?'placeholder':''}>{selected<0?placeholder:options[selected].label}</span><ChevronDown size={16} aria-hidden="true"/>
  </button>
  {open&&<ul id={id+'-list'} role="listbox" aria-label={label} className="fancy-options">{options.map((option,i)=><li id={`${id}-option-${i}`} key={option.value} role="option" aria-selected={i===selected} className={(active===i?'focused ':'')+(i===selected?'selected':'')} onMouseEnter={()=>setActive(i)} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(i)}><span>{option.label}</span>{i===selected&&<Check size={15} aria-hidden="true"/>}</li>)}</ul>}
 </div>;
}
