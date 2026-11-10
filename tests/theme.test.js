import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const css=await readFile(new URL('../src/style.css',import.meta.url),'utf8');
function color(block,key){const m=block.match(new RegExp(`--${key}:(#[0-9a-fA-F]{6})(?:;|})`));assert.ok(m,`missing ${key}`);return m[1]}
function lum(hex){const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722}
function contrast(a,b){const [x,y]=[lum(a),lum(b)].sort((a,b)=>a-b);return (y+.05)/(x+.05)}
test('primary and secondary copy meet contrast targets in both themes',()=>{
 for(const block of [css.match(/:root\{[^}]+\}/)[0],css.match(/html\[data-theme=dark\]\{[^}]+\}/)[0]]){
  for(const background of ['bg','surface'])for(const foreground of ['ink','muted'])assert.ok(contrast(color(block,foreground),color(block,background))>=4.5,`${foreground} on ${background}`);
 }
});
test('diagram labels remain legible on their colored backgrounds in both themes',()=>{
 const light=[...css.matchAll(/:root\{[^}]+\}/g)].map(m=>m[0]).find(block=>block.includes('--diagram-blue:'));
 const dark=[...css.matchAll(/html\[data-theme=dark\]\{[^}]+\}/g)].map(m=>m[0]).find(block=>block.includes('--diagram-blue:'));
 for(const block of [light,dark]){
  assert.ok(block,'missing diagram palette');
  for(const variant of ['blue','violet','amber'])assert.ok(contrast(color(block,`diagram-${variant}`),color(block,`diagram-${variant}-ink`))>=4.5,variant);
 }
});
