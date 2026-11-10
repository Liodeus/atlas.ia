import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';

export function Eyebrow({children}){return <div className="eyebrow"><span className="eyebrow-dot"/> {children}</div>}
export function ChoiceGroup({name,legend,value,onChange,options,compact=false}){return <fieldset className={'choice-group '+(compact?'compact':'')}><legend>{legend}</legend><div className="selection-grid">{options.map(option=><label key={option.value} className={'selection-label '+(option.disabled?'disabled':'')}><input type="radio" name={name} value={option.value} checked={value===option.value} disabled={option.disabled} onChange={()=>onChange(option.value)}/><span className="selection-card"><span className="selection-indicator" aria-hidden="true"/><span><b>{option.title}</b>{option.description&&<small>{option.description}</small>}</span></span></label>)}</div></fieldset>}
export function PageHead({eyebrow,title,description,headingRef}){return <div className="pagehead"><Eyebrow>{eyebrow}</Eyebrow><h1 ref={headingRef} tabIndex={headingRef?-1:undefined}>{title}</h1>{description&&<p>{description}</p>}</div>}
export function Btn({to,children,secondary=false,state}){return <Link state={state} className={'button '+(secondary?'secondary':'')} to={to}>{children}<ArrowRight size={16}/></Link>}
