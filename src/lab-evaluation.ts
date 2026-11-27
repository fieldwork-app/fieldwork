import {REPOSITORY} from './site.js';
/** A LAB EVALUATION PASS: one evaluator's findings against Nielsen's ten usability heuristics, for one screen.
 *
 *  Experiment 184. The practitioner, 2026-11-07: *"Perhaps we can make a pop up form for this JK evaluation for test
 *  sections e.g. widgets so it is in the workflow and can be saved to laptop so it can be reviewed."* Shown only when
 *  lab evaluation is switched on; saved as Markdown to read and JSON to merge.
 *
 *  Finding and rating are separate on purpose: Nielsen's guidance is to collect problems first and have each evaluator
 *  rate the merged list alone. So a pass holds findings and no severity.
 *
 *  The heuristics' names are Nielsen's (nngroup.com, 1994, reviewed 2024); the one-line questions are this project's.
 *  The form's own words are kept to labels and those questions, because the evaluation's first lens is design
 *  explanation crowding the screen. */
export interface Heuristic {id:string; name:string; ask:string}
export const HEURISTICS:Heuristic[]=[
  {id:'H1',name:'Visibility of system status',ask:'Can you tell what is happening, and what just happened?'},
  {id:'H2',name:'Match between the system and the real world',ask:'Are these your words, or the system’s?'},
  {id:'H3',name:'User control and freedom',ask:'Can you leave or undo without losing work?'},
  {id:'H4',name:'Consistency and standards',ask:'Does the same thing look and read the same everywhere?'},
  {id:'H5',name:'Error prevention',ask:'Is a mistake stopped before it happens?'},
  {id:'H6',name:'Recognition rather than recall',ask:'Is what you need on screen, or must you remember it?'},
  {id:'H7',name:'Flexibility and efficiency of use',ask:'Can someone experienced go faster?'},
  {id:'H8',name:'Aesthetic and minimalist design',ask:'Is anything here that the task does not need?'},
  {id:'H9',name:'Help users recognize, diagnose, and recover from errors',ask:'Does an error say what went wrong and how to fix it?'},
  {id:'H10',name:'Help and documentation',ask:'Is help there when you need it, and short?'},
];

/** What a piece of on-screen text does, for the lens experiment 184 looks through first. */
export const TEXT_KINDS=['instruction','status','design explanation'] as const;

export interface Finding {heuristic:string; happens:string; costs:string; textKind?:string}
export interface EvaluationPass {
  schema:'fieldwork/lab-evaluation/1';
  evaluator:string;
  screen:string;
  widget?:{type:string; version:string};
  appVersion:string;
  at:string;
  findings:Finding[];
  works:string;
}

const text=(v:unknown)=>typeof v==='string'?v.trim():'';

/** Read a pass back, keeping what is there and dropping a finding with nothing written. */
export function readPass(raw:unknown):EvaluationPass|null{
  if(!raw||typeof raw!=='object')return null;
  const r=raw as Record<string,unknown>;
  if(r.schema!=='fieldwork/lab-evaluation/1')return null;
  const w=r.widget as Record<string,unknown>|undefined;
  const findings=(Array.isArray(r.findings)?r.findings:[]).flatMap(f=>{
    const x=f as Record<string,unknown>;
    const happens=text(x.happens),costs=text(x.costs);
    if(!happens&&!costs)return [];
    return [{heuristic:text(x.heuristic),happens,costs,...(text(x.textKind)?{textKind:text(x.textKind)}:{})}];
  });
  return {schema:'fieldwork/lab-evaluation/1',evaluator:text(r.evaluator),screen:text(r.screen),
    ...(w&&text(w.type)?{widget:{type:text(w.type),version:text(w.version)}}:{}),
    appVersion:text(r.appVersion),at:text(r.at),findings,works:text(r.works)};
}

/** Only what was written: an empty finding is a blank row in the form, not a finding. */
export function cleanPass(pass:EvaluationPass):EvaluationPass{return readPass(pass)!;}

const cell=(s:string)=>s.replace(/\|/g,'\\|').replace(/\s*\n\s*/g,' ');
export function toMarkdown(raw:EvaluationPass):string{
  const pass=cleanPass(raw);
  const name=(id:string)=>HEURISTICS.find(h=>h.id===id)?.name||id;
  const lines=[`# Lab evaluation: ${pass.screen||'unnamed screen'}`,'',
    `- Evaluator: ${pass.evaluator||'not given'}`,
    `- Screen: ${pass.screen||'not given'}`,
    ...(pass.widget?[`- Widget: ${pass.widget.type} ${pass.widget.version}`]:[]),
    `- Fieldwork: ${pass.appVersion||'unknown'}`,
    `- Saved: ${pass.at}`,
    `- Heuristics: Nielsen's ten usability heuristics. Findings only; severity is rated later, on the merged list.`,'',
    `## Findings (${pass.findings.length})`,''];
  if(pass.findings.length){
    lines.push('| # | Heuristic | What happens | What it costs | Text |','| --- | --- | --- | --- | --- |');
    pass.findings.forEach((f,i)=>lines.push(`| ${i+1} | ${f.heuristic} ${cell(name(f.heuristic))} | ${cell(f.happens)} | ${cell(f.costs)} | ${cell(f.textKind||'')} |`));
  }else lines.push('None recorded.');
  lines.push('','## What works','',pass.works||'Nothing recorded.','');
  return lines.join('\n');
}

/** A file name a reader can sort: the screen, the evaluator and the moment, nothing else. */
export function fileStem(pass:EvaluationPass):string{
  const slug=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g,'').trim().replace(/[\s_]+/g,'-').slice(0,40);
  const at=pass.at.replace(/[:]/g,'').replace(/\..*$/,'');
  return ['fieldwork-evaluation',slug(pass.screen)||'screen',slug(pass.evaluator)||'evaluator',at].join('-');
}

/** A FINDING AS A GITHUB ISSUE, in the repository's own form (`.github/ISSUE_TEMPLATE/lab-evaluation.yml`), its fields
 *  filled in from the evaluation. The practitioner, 2026-11-15: *"The evaluation is not helpful unless it's able to
 *  populate GitHub Issues"*, and *"let's make sure we have a standard format for submitting GitHub Issues."* The link
 *  opens GitHub's new-issue page with the form filled; the person reads it and submits it. Nothing is posted for them,
 *  and no token is needed. */
export const ISSUE_REPOSITORY=REPOSITORY;
export function findingIssueUrl(pass:EvaluationPass,finding:Finding,environment=''):string{
  const h=HEURISTICS.find(x=>x.id===finding.heuristic);
  const params=new URLSearchParams({template:'lab-evaluation.yml',
    title:`[Evaluation] ${pass.screen||'a screen'}: ${h?.name||finding.heuristic}`,
    screen:pass.screen,version:pass.appVersion,
    ...(pass.widget?{widget:`${pass.widget.type} ${pass.widget.version}`}:{}),
    ...(h?{heuristic:`${h.id} ${h.name}`}:{}),
    happens:finding.happens,costs:finding.costs,
    'text-kind':finding.textKind||'not about text',
    evaluator:pass.evaluator,...(environment?{environment}:{})});
  return `https://github.com/${ISSUE_REPOSITORY}/issues/new?${params}`;
}
