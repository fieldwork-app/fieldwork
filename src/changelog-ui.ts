/** WHAT CHANGED IN THIS VERSION (the practitioner, 2026-11-10: "When I click on the FW version button, can we show a
 *  modal dialog that describes the changelog for the version?"). The notes are CHANGELOG.md's, split by version at build
 *  time into build/changelog.json and carried with the application, so they open offline too. */
import {toHTML} from './prose.js';

interface Release {version:string; date:string; markdown:string}
const SOURCE='https://github.com/fieldwork-app/fieldwork/blob/main/CHANGELOG.md';

export async function openChangelog(version:string,esc:(v:string)=>string):Promise<void>{
  document.getElementById('changelog-dialog')?.remove();
  const dialog=document.createElement('dialog');
  dialog.id='changelog-dialog';
  dialog.setAttribute('aria-labelledby','changelog-title');
  document.body.append(dialog);
  const close=()=>{dialog.close();dialog.remove();};
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  let releases:Release[]=[];
  try{
    const response=await fetch('./build/changelog.json');
    if(!response.ok)throw new Error(String(response.status));
    releases=(await response.json() as {releases:Release[]}).releases;
  }catch(error){
    dialog.innerHTML=`<div class="manual-head"><h2 id="changelog-title">Fieldwork v${esc(version)}</h2>`
      +`<button class="button" id="changelog-close">Close</button></div>`
      +`<p>The release notes could not be read (${esc(error instanceof Error?error.message:String(error))}). `
      +`They are also at <a href="${SOURCE}" target="_blank" rel="noopener noreferrer">CHANGELOG.md</a>.</p>`;
    dialog.querySelector<HTMLButtonElement>('#changelog-close')!.onclick=close;
    dialog.showModal();return;
  }
  // BY SERIES, x.y with every x.y.z in it (the practitioner, 2026-11-10: "Version changelog should include x.x so that
  // includes x.x.1-n"): the version running is read with the patches around it, newest first.
  const seriesOf=(v:string)=>v.split('.').slice(0,2).join('.');
  const series=[...new Set(releases.map(r=>seriesOf(r.version)))];
  const mine=seriesOf(version);
  let index=Math.max(0,series.indexOf(mine));
  const show=()=>{
    const name=series[index]!,newer=series[index-1],older=series[index+1];
    const inSeries=releases.filter(r=>seriesOf(r.version)===name);
    dialog.innerHTML=`<div class="manual-head"><h2 id="changelog-title" tabindex="-1">What changed in v${esc(name)}</h2>`
      +`<button class="button" id="changelog-close">Close</button></div>`
      +`<p class="muted">${inSeries.length===1?'One release':`${inSeries.length} releases`}, `
        +`${esc(inSeries.at(-1)!.date)}${inSeries.length>1&&inSeries[0]!.date!==inSeries.at(-1)!.date?` to ${esc(inSeries[0]!.date)}`:''}`
        +`${name===mine?` · you are running v${esc(version)}`:''}</p>`
      +inSeries.map(r=>`<section class="changelog-release" data-version="${esc(r.version)}"><h3>v${esc(r.version)}`
        +`${r.version===version?' · the version you are running':''}</h3>`
        +`<article class="manual-body">${toHTML(r.markdown,{links:true})}</article></section>`).join('')
      +`<div class="changelog-nav">`
        +(older?`<button class="button" id="changelog-older">← v${esc(older)}</button>`:'')
        +(newer?`<button class="button" id="changelog-newer">v${esc(newer)} →</button>`:'')
        +(name!==mine&&series.includes(mine)?`<button class="button" id="changelog-current">Back to v${esc(mine)}</button>`:'')
      +`</div><p class="muted">Every version: <a href="${SOURCE}" target="_blank" rel="noopener noreferrer">CHANGELOG.md</a>.</p>`;
    dialog.querySelector<HTMLButtonElement>('#changelog-close')!.onclick=close;
    const go=(id:string,to:number)=>{const b=dialog.querySelector<HTMLButtonElement>(id);if(b)b.onclick=()=>{index=to;show();dialog.querySelector<HTMLElement>('#changelog-title')?.focus();};};
    go('#changelog-older',index+1);go('#changelog-newer',index-1);go('#changelog-current',series.indexOf(mine));
  };
  show();
  dialog.showModal();
}
