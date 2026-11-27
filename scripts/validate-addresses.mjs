/** FIELDWORK'S ADDRESS, WRITTEN ONCE (2026-11-27). The practitioner, after the move to fieldwork-app: *"Why don't we make
 *  the URLs templated so we can easily change URLs without having to hand edit many files?"* The address is
 *  `package.json`'s `homepage` and `repository`. Code reads it through `src/site.ts`, the ontology's manual links are
 *  written from it, tests read it through `tests/site.mjs`. What cannot read it (the README, the schema's `$id`, slides,
 *  other repositories) is checked against it here.
 *
 *  Fails on: a live file naming Fieldwork at another address; a source file, script or test typing the address rather
 *  than reading it. Dated records keep the address they had and are not read: experiments, audits, research notes, the
 *  changelog, TODO, the history files and widget releases.
 *
 *  Usage: node scripts/validate-addresses.mjs [--siblings]
 *    --siblings  also reports, without failing, the sibling repositories' links to Fieldwork. */
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';

const root=new URL('..',import.meta.url).pathname;
const project=JSON.parse(readFileSync(join(root,'package.json'),'utf8'));
const repositoryUrl=project.repository.url.replace(/\.git$/,'').replace(/\/$/,'');
const [owner,name]=repositoryUrl.replace(/^https:\/\/github\.com\//,'').split('/');
const site=new URL(project.homepage);

const DATED=[/^docs\/experiments\//,/^docs\/audits\//,/^docs\/research\//,/^docs\/todo-history\.md$/,/^CHANGELOG\.md$/,/^TODO\.md$/,
  /^docs\/history-rewrite/,/^widgets\/releases\//,/^build\//,/^sw\.js$/,/^tests\/fixtures\//,/^content\/results\//,/^content\/fixtures\//];
const TEXT=/\.(md|ts|tsx|mjs|js|json|html|ttl|yml|yaml|css|txt|tsv)$/;
/** Where code must read the address, not type it. */
const READS=/^(src|scripts|tests)\//;
const READERS=new Set(['src/site.ts','tests/site.mjs','scripts/validate-addresses.mjs']);

// Fieldwork at any owner: github.com/<owner>/<name>, raw.githubusercontent.com/<owner>/<name>, <owner>.github.io/<name>.
const ADDRESS=new RegExp(`(?:github\\.com|raw\\.githubusercontent\\.com)/([\\w-]+)/${name}(?![\\w-])|([\\w-]+)\\.github\\.io/${name}(?![\\w-])`,'g');

function scan(dir,{reads}){
  const files=execFileSync('git',['-C',dir,'ls-files'],{encoding:'utf8'}).split('\n').filter(f=>f&&TEXT.test(f)&&!DATED.some(d=>d.test(f)));
  const other=[],typed=[];
  for(const file of files){
    const path=join(dir,file);if(!existsSync(path))continue;
    readFileSync(path,'utf8').split('\n').forEach((line,i)=>{
      for(const m of line.matchAll(ADDRESS)){
        const at=m[1]??m[2];
        if(at!==owner)other.push(`${file}:${i+1} names ${m[0]}`);
        else if(reads&&READS.test(file)&&!READERS.has(file))typed.push(`${file}:${i+1} types ${m[0]}; read it from src/site.ts or tests/site.mjs`);
      }
    });
  }
  return {files:files.length,other,typed};
}

const here=scan(root,{reads:true});
console.log(`Addresses: Fieldwork at ${owner}/${name}, site ${site.href}; ${here.files} files read, dated records set aside.`);
for(const line of [...here.other,...here.typed])console.log(`  ${line}`);
if(process.argv.includes('--siblings')){
  const parent=join(root,'..');
  const siblings=execFileSync('ls',[parent],{encoding:'utf8'}).split('\n').filter(d=>d&&d!=='fieldwork'&&!d.startsWith('fieldwork-review')&&existsSync(join(parent,d,'.git')));
  for(const d of siblings){const s=scan(join(parent,d),{reads:false});
    if(s.other.length)console.log(`  sibling ${d}: ${s.other.length} naming another address (reported, not failed)\n${s.other.map(l=>`    ${l}`).join('\n')}`);}
}
if(here.other.length||here.typed.length)process.exit(1);
