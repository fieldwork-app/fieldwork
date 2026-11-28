/** The distributed user manual: one page per widget, browsable inside the application.
 *
 *  The practitioner's proposal of 2026-10-14 -- a set of markdowns, "browsed within FieldWork not
 *  a markdown in the repo". The pages are compiled to HTML at build time by
 *  scripts/widget-manual.mjs, so nothing is parsed or fetched at run time, and the ontology entry
 *  for each widget carries `fw:userManual` pointing at the same page: "where is the documentation
 *  for this?" is a question the graph answers rather than a convention a reader has to know. */
import {escapeHtml} from './html-escape.js';
import pages from '../widgets/manual-pages.json';
import {repositoryFile} from './site.js';

export const MANUAL_PAGES=pages as Record<string,string>;
export const hasManual=(nodeType:string):boolean=>Object.hasOwn(MANUAL_PAGES,nodeType);
/** A page for one of the application's own surfaces rather than a widget, keyed `surface:<name>`. */
const surfaceOf=(key:string):string|undefined=>key.startsWith('surface:')?key.slice('surface:'.length):undefined;
const sourcePath=(key:string):string=>surfaceOf(key)?`docs/surfaces/${surfaceOf(key)}.md`:`docs/widgets/${key}.md`;
export const manualSource=(nodeType:string):string=>
  repositoryFile(sourcePath(nodeType));


export function openManual(nodeType:string,title:string,esc:(v:string)=>string):void{
  const page=MANUAL_PAGES[nodeType];
  if(!page)return;
  const dialog=document.createElement('dialog');
  dialog.id='manual-dialog';
  dialog.setAttribute('aria-labelledby','manual-title');
  dialog.innerHTML=`<div class="manual-head"><h2 id="manual-title">${esc(title)}</h2>`
    +`<div class="inspector-actions"><button class="button" id="manual-detach-page">Detach</button>`
    +`<button class="button" id="manual-close">Close</button></div></div>`
    +pageBody(nodeType,page,esc);
  document.body.append(dialog);
  const close=()=>{dialog.close();dialog.remove();};
  dialog.querySelector<HTMLButtonElement>('#manual-close')!.onclick=close;
  dialog.querySelector<HTMLButtonElement>('#manual-detach-page')!.onclick=()=>{
    const scroll=dialog.scrollTop;close();keepPage({nodeType,title});renderManualPage(scroll);};
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.showModal();
}

const pageBody=(nodeType:string,page:string,esc:(v:string)=>string)=>`<article class="manual-body">${page}</article>`
  +`<p class="muted">This page is part of the manual carried in this build. Its source is `
  +`<a href="${manualSource(nodeType)}" target="_blank" rel="noopener noreferrer">${esc(sourcePath(nodeType))}</a>`
  +(surfaceOf(nodeType)?'.</p>':`, and the widget's ontology entry points at it with <code>fw:userManual</code>.</p>`);

/** A WIDGET'S PAGE, DETACHED (the practitioner, 2026-11-14: "Can the Manual be detached?"), as a worked example's manual
 *  is (experiment 173): a panel that is not modal, so the step can be configured while the page is read; dragged by its
 *  header; held on this device, so a reload keeps it; closed only by Close. It opens at the top left of the canvas, clear
 *  of the Inspector where Configure… is, and above a worked example's manual, which opens at the bottom left. */
const PAGE_DETACHED='fieldwork-widget-manual-detached-v1';
interface DetachedPage {nodeType:string; title:string; left?:number; top?:number}
const heldPage=():DetachedPage|undefined=>{try{const raw=localStorage.getItem(PAGE_DETACHED);return raw?JSON.parse(raw) as DetachedPage:undefined;}catch{return undefined;}};
const keepPage=(state:DetachedPage|undefined)=>{
  try{if(state)localStorage.setItem(PAGE_DETACHED,JSON.stringify(state));else localStorage.removeItem(PAGE_DETACHED);}
  catch{/* the panel still opens; it is not remembered */}};
const escText=escapeHtml;
export function renderManualPage(scroll=0):void{
  const state=heldPage(),page=state?MANUAL_PAGES[state.nodeType]:undefined;
  let panel=document.getElementById('widget-manual-float');
  if(!state||!page){panel?.remove();return;}
  if(!panel){panel=document.createElement('aside');panel.id='widget-manual-float';panel.className='manual-float widget-manual-float';
    panel.setAttribute('role','dialog');panel.setAttribute('aria-label',`Manual: ${state.title}`);document.body.append(panel);}
  panel.innerHTML=`<header class="manual-float-head"><strong>Manual \u00b7 ${escText(state.title)}</strong>`
    +`<button class="button small" id="widget-manual-float-close">Close</button></header>`
    +`<div class="manual-float-body">${pageBody(state.nodeType,page,escText)}</div>`;
  if(state.left!==undefined&&state.top!==undefined){
    panel.style.left=`${Math.max(0,Math.min(state.left,innerWidth-120))}px`;panel.style.top=`${Math.max(0,Math.min(state.top,innerHeight-60))}px`;
    panel.style.right='auto';panel.style.bottom='auto';}
  panel.querySelector<HTMLElement>('.manual-float-body')!.scrollTop=scroll;
  panel.querySelector<HTMLButtonElement>('#widget-manual-float-close')!.onclick=()=>{keepPage(undefined);renderManualPage();};
  const head=panel.querySelector<HTMLElement>('.manual-float-head')!;
  head.onpointerdown=e=>{
    if((e.target as HTMLElement).closest('button'))return;
    const box=panel!.getBoundingClientRect(),dx=e.clientX-box.left,dy=e.clientY-box.top;
    head.setPointerCapture(e.pointerId);
    head.onpointermove=m=>{panel!.style.left=`${m.clientX-dx}px`;panel!.style.top=`${m.clientY-dy}px`;panel!.style.right='auto';panel!.style.bottom='auto';};
    head.onpointerup=()=>{head.onpointermove=null;head.onpointerup=null;const placed=panel!.getBoundingClientRect(),now=heldPage();
      if(now)keepPage({...now,left:Math.round(placed.left),top:Math.round(placed.top)});};
  };
}
