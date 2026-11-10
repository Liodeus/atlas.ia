import React from 'react';
import {toggleStudyMark} from './studyMarks.js';
export function StudyMarks({data,setData,group,id,label}){
 const mark=data.studyMarks?.[group]?.[id];
 return <div className="study-marks" role="group" aria-label={label}><span>{label}</span><div>{[['review','À revoir'],['deep','À approfondir']].map(([value,text])=><button type="button" key={value} aria-pressed={mark===value} className={mark===value?'selected':''} onClick={()=>setData(current=>({...current,studyMarks:toggleStudyMark(current.studyMarks,group,id,value)}))}>{text}</button>)}</div></div>;
}
