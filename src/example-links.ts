/** WHERE A WORKED EXAMPLE LIVES ONLINE, as two QR codes in the write-up (experiment 203).
 *
 *  The practitioner, 2026-11-10: *"there should be QR codes in a note for worked example just to point to 2 things, to
 *  FieldWork itself on Git Pages and to the worked example in question"*, and *"Fieldwork QR code can already point to
 *  the worked example automatically loaded? This way we still have 2 QR codes"*.
 *
 *  1. Fieldwork with the example opened, at the published site, never at the address this page happens to be served
 *     from (a local copy would print `localhost`).
 *  2. The example's own files. A repository example is pinned to a commit in the catalog, and the code names that
 *     commit, so a printed code opens the version the write-up was made from. A built-in example's files are in
 *     Fieldwork's repository, whose releases name no commit, so its code names `main` and says it is the latest.
 *
 *  Assembled from the catalog and the project on every render, like References; never stored as a note. */
import {qrSvg} from './qr.js';
import {SITE_URL,REPOSITORY_URL} from './site.js';

export const FIELDWORK_URL=SITE_URL;
const FIELDWORK_REPOSITORY=REPOSITORY_URL;

export interface ExampleLinks {title:string; app:string; files:string; pinned:boolean}

/** The slug `?example=` takes for a catalog example: its id after the last colon. */
export const exampleSlug=(id:string)=>id.slice(id.lastIndexOf(':')+1);

export function catalogLinks(example:{id:string;title:string;repository:string;commit:string}):ExampleLinks{
  return {title:example.title,app:`${FIELDWORK_URL}?example=${encodeURIComponent(exampleSlug(example.id))}`,
    files:`${example.repository.replace(/\/$/,'')}/tree/${example.commit}`,pinned:true};
}

/** The built-in examples with files of their own in Fieldwork's repository, by project. */
const BUILT_IN_FOLDERS:Record<string,string>={'hagelloch-1861':'examples/hagelloch-1861','cholera-london-1854':'examples/john-snow'};

export function builtInLinks(project:{id:string;name:string;workflows:readonly string[]},workflowKey:string):ExampleLinks|null{
  const folder=BUILT_IN_FOLDERS[project.id];
  if(!folder)return null;
  return {title:project.name,app:`${FIELDWORK_URL}?example=${encodeURIComponent(workflowKey)}`,
    files:`${FIELDWORK_REPOSITORY}/tree/main/${folder}`,pinned:false};
}

/** The block the write-up shows: per example, two codes, each with its address printed beneath it. */
export function exampleLinksBlock(links:readonly ExampleLinks[],esc:(s:string)=>string):string{
  if(!links.length)return '';
  const card=(href:string,label:string)=>`<figure class="example-qr">${qrSvg(href,150,`QR code: ${label}`,true)}`
    +`<figcaption><strong>${esc(label)}</strong><br><a href="${esc(href)}">${esc(href)}</a></figcaption></figure>`;
  return `<section class="example-links" aria-label="This worked example, online"><h4>This worked example, online</h4>`
    +links.map(l=>`<p class="muted">${esc(l.title)}</p><div class="example-qr-pair">`
      +card(l.app,'Fieldwork, with this example opened')
      +card(l.files,l.pinned?'This worked example: data, workflows and manual, at the version this was made from'
        :'This worked example’s files: the latest version, not pinned')
      +`</div>`).join('')+`</section>`;
}
