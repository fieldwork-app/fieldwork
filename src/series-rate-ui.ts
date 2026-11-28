/** CASES BY PERIOD AND RATE, OUT OF APP.TS (2026-11-22, the Inspector move's first batch): their one sentences, their
 *  Configure… dialogs and their standard Inspectors -- name, inputs, sentence, Configure…, and what the last run said.
 *  Moved as they were; what they read of the application comes through the kit. */
import type {WorkflowNode} from './types.js';
import type {OwnInspector,StepKit} from './inspector-kit.js';
import type {DataTable} from './data-table.js';
import {openConfigDialog} from './config-dialog.js';
import {computeRate,fromTable,fromWideTable} from './rate.js';
import {PERIOD_WORDS,DATE_KINDS,caseSeries,caseSeriesFromTable,type CaseSeries} from './case-series.js';

export interface SeriesRateKit extends StepKit {
  /** The columns of the records arriving, by their attribute names. */
  columns:(nodeId:string)=>string[];
  /** Rate's table on its records port, where one can be read without a run, and the columns it brings. */
  rateColumns:(nodeId:string)=>{table?:DataTable;columns:string[]};
  /** Whether anything is connected after the step. */
  feedsAnything:(nodeId:string)=>boolean;
  /** Adds an epidemic curve after Cases by period, connected, and selects it. */
  addCurve:(n:WorkflowNode<'case_series'>)=>void;
  /** THE CASES ARRIVING ON THIS STEP'S INPUT (2026-11-25), as its own function takes them: the table where records
   *  arrive as a table, the points otherwise. Empty where nothing is connected, or where the records exist only as
   *  the output of a run that has not happened -- the Preview says which, rather than going blank. */
  casesOn:(nodeId:string,source?:'points'|'table')=>{table?:DataTable;points?:import('./types.js').PointCollection};
}

/** RATE'S ONE SENTENCE (experiment 186). */
export function rateSentence(p:import('./types.js').ParamsByType['rate']):string{
  if(!p.numeratorField||!p.denominatorField)return 'Not set up yet: choose what is counted and the population at risk, in Configure…';
  return `Divides ${p.numeratorField} by ${p.denominatorField} (${p.denominatorUnit}), per ${p.multiplier.toLocaleString()}`
    +`${p.groupBy?`, by ${p.groupBy}`:''}, as a ${p.rateKind}`
    +`${p.source==='table'?`, from a table with ${p.tableForm==='wide'?'both numbers on each row':'one row per measure'}`:''}.`;
}

/** WHAT CASES BY PERIOD COUNTS, in one sentence (experiment 186). */
export function seriesSentence(p:import('./types.js').ParamsByType['case_series']):string{
  if(!p.dateField)return 'Name the column holding each case\u2019s date in Configure\u2026';
  return `Counts cases by ${PERIOD_WORDS[p.period]} of ${p.dateField}, a date of ${p.dateKind}`
    +(p.splitBy?`, for each value of ${p.splitBy}`:'')
    +(p.source==='table'?(p.rowAsCase?(p.caseId?`, each ${p.caseId} once.`:', one case per row.'):', each row as many cases as its value.'):p.weightField?`, each record as many cases as its ${p.weightField}.`:', one case per record.');
}
/** WHAT CASES BY PERIOD WOULD COUNT, from the records actually connected (2026-11-25).
 *
 *  Its Preview restated the settings -- `seriesSentence(draft)`, built from the node's params and nothing else -- so
 *  it read like a preview while showing nothing of this workflow's data. The practitioner met it as *"Same problem no
 *  preview"*, one of a run of dialogs, and the audit that followed found eleven more of the same kind
 *  (docs/audits/preview-audit.md). The sentence is not lost: the Inspector shows it, which is where a settings
 *  summary belongs.
 *
 *  This runs the step's OWN function -- `caseSeries` on points, `caseSeriesFromTable` on a table -- so the Preview
 *  cannot show something the run would not do.
 *
 *  THE UNDATED RECORDS ARE THE FINDING, and they are stated whenever there are any. A count by date silently drops a
 *  record whose date cannot be read, and Oswego arrives with two such onset times: the number here is the reader's
 *  one chance to see them before the curve is drawn as though they never existed. */
/** THE CURVE THIS STEP WOULD MAKE, DRAWN (2026-11-28). The preview audit's re-review of 2026-11-27 listed this Preview
 *  as numbers, no curve, with no reason recorded. The bins are the step's own, zero periods kept, so a gap in the
 *  outbreak is a gap here. Split by a column, each period is drawn as the sum over its values and the key says so:
 *  the stacked picture is Chart's, after the step. Drawn in Detect unusual counts' bars, so the two curves read alike. */
function seriesCurve(series:CaseSeries,esc:(v:string)=>string):string{
  const totals=new Map<string,{label:string;count:number}>();
  for(const b of series.bins){const held=totals.get(b.key);if(held)held.count+=b.count;else totals.set(b.key,{label:b.label,count:b.count});}
  const bins=[...totals.values()],N=bins.length;
  if(!N)return '';
  const W=760,H=220,L=48,B=28,top=12,max=Math.max(1,...bins.map(b=>b.count));
  const x=(i:number)=>L+(i+0.5)*(W-L-8)/N,y=(v:number)=>H-B-(v/max)*(H-B-top),bw=Math.max(1,(W-L-8)/N*0.8);
  const num=(v:number)=>v.toLocaleString('en-US',{maximumFractionDigits:1});
  const bars=bins.map((b,i)=>`<rect x="${(x(i)-bw/2).toFixed(1)}" y="${y(b.count).toFixed(1)}" width="${bw.toFixed(1)}" height="${(H-B-y(b.count)).toFixed(1)}" `
    +`class="detect-bar"><title>${esc(b.label)}: ${num(b.count)}</title></rect>`).join('');
  const ticks=[0,max/2,max].map(v=>`<text x="${L-6}" y="${(y(v)+5).toFixed(1)}" text-anchor="end" class="detect-axis">${num(v)}</text>`).join('');
  const labels=[0,Math.floor((N-1)/2),N-1].filter((v,i,a)=>a.indexOf(v)===i)
    .map(i=>`<text x="${(i===0?L:i===N-1?W-8:x(i)).toFixed(1)}" y="${H-8}" text-anchor="${i===0?'start':i===N-1?'end':'middle'}" class="detect-axis">${esc(bins[i]!.label)}</text>`).join('');
  return `<figure class="detect-chart series-curve"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`${series.unit??'Cases'} by ${PERIOD_WORDS[series.period]}`)}">`
    +`<line x1="${L}" y1="${H-B}" x2="${W-8}" y2="${H-B}" class="detect-axis-line"/>${ticks}${labels}${bars}</svg>`
    +`<figcaption><ul class="walk-key"><li>${esc(`Bars: the ${series.unit??'cases'} in each ${PERIOD_WORDS[series.period]}`
      +(series.splitBy?`, every value of ${series.splitBy} together`:''))}.</li></ul></figcaption></figure>`;
}
function seriesPreview(kit:SeriesRateKit,nodeId:string,d:import('./types.js').ParamsByType['case_series'],
  esc:(v:string)=>string):string{
  if(!d.dateField)return '<p class="muted">Name the date column, and what this step would count is shown here.</p>';
  const {table,points}=kit.casesOn(nodeId,d.source);
  if(!table&&!points)return `<p class="muted">Connect the ${d.source==='table'?'table of cases':'cases'}, and `
    +'what this step would count is shown here.</p>';
  let series:CaseSeries;
  try{
    series=table
      ?caseSeriesFromTable(table,{dateField:d.dateField,dateKind:d.dateKind,period:d.period,
        splitBy:d.splitBy??null,rowAsCase:!!d.rowAsCase,caseId:d.caseId??null})
      :caseSeries(points!,{dateField:d.dateField,dateKind:d.dateKind,period:d.period,
        weightField:d.weightField,splitBy:d.splitBy});
  }catch(error){
    return `<p class="muted">This cannot be counted yet: ${esc(error instanceof Error?error.message:String(error))}</p>`;
  }
  const periods=new Set(series.bins.map(b=>b.key)).size;
  const peak=series.bins.reduce<typeof series.bins[number]|null>((best,b)=>!best||b.count>best.count?b:best,null);
  const word=PERIOD_WORDS[series.period];
  const n=(v:number)=>v.toLocaleString('en-US');
  return seriesCurve(series,esc)+`<p class="standard-result"><strong>${n(series.total)}</strong> `
    +`${esc(series.unit??'cases')} in <strong>${n(periods)}</strong> ${esc(word)}${periods===1?'':'s'}`
    +(series.firstPeriod&&series.lastPeriod
      ?`, ${esc(series.firstPeriod)} to ${esc(series.lastPeriod)}`:'')
    +'.'+(peak?` The most in one ${esc(word)} is <strong>${n(peak.count)}</strong>, ${esc(peak.label)}.`:'')
    +(series.groups?.length?` Counted for each of ${n(series.groups.length)} values of ${esc(series.splitBy??'')}.`:'')
    +'</p>'
    // SAID WHENEVER THERE ARE ANY, and not as a warning: an unreadable date is a fact about the records, for the
    // reader to decide about, not a refusal. Named where few enough to name.
    +(series.undatedRecords
      ?`<p class="profile-flag">${n(series.undatedRecords)} of `
        +`${n(series.datedRecords+series.undatedRecords)} records have no date this step can read, `
        +`so they are not counted${series.undated.length&&series.undated.length<=3
          ?`: ${series.undated.map(u=>esc(`${u.name||u.id} (${u.value||'empty'})`)).join(', ')}`:''}.</p>`
      :'');
}

/** CASES BY PERIOD'S CONFIGURATION DIALOG (experiments 186 and 206, 2026-11-12): how the records arrive, the date column
 *  and its kind, the period (day of the week among them), and the weight. Changing how records arrive disconnects
 *  what was wired, as Rate does. */
function openSeriesConfig(kit:SeriesRateKit,nodeId:string){
  const esc=kit.esc,node=kit.workflow().nodes.find(x=>x.id===nodeId) as WorkflowNode<'case_series'>|undefined;if(!node)return;
  type Draft=import('./types.js').ParamsByType['case_series'];
  const columns=kit.columns(nodeId);
  openConfigDialog<Draft>({
    id:'series-config',widget:'Cases by period',step:node.params.label||kit.title('case_series'),draft:structuredClone(node.params),
    sections:d=>{
      const pick=(id:string,label:string,key:'dateField'|'weightField'|'splitBy'|'caseId',placeholder:string,optional=false)=>{
        const held=String(d[key]??'');
        return `<div class="field"><label class="field-label" for="${id}">${label}</label>`+(columns.length
          ?`<select id="${id}" data-series="${key}"><option value="">${optional?(key==='splitBy'?'Not split: one count per period':key==='caseId'?'Not named: every row a case':'Not used: one case per record'):'Choose…'}</option>`
            +columns.map(c=>`<option value="${esc(c)}" ${c===held?'selected':''}>${esc(c)}</option>`).join('')+'</select>'
          :`<input id="${id}" data-series="${key}" maxlength="60" value="${esc(held)}" placeholder="${esc(placeholder)}">`)+'</div>';};
      const settings=`<div class="field"><label class="field-label" for="series-input">Records arrive as</label><select id="series-input">`
        +[['points','points, one per record'],['table','a table, each row a count'],['table-case','a table, each row one case']]
          .map(([v,t])=>`<option value="${v}" ${(d.source==='table'?(d.rowAsCase?'table-case':'table'):'points')===v?'selected':''}>${t}</option>`).join('')+'</select></div>'
        +pick('series-date','Date column','dateField','onset_date')
        +`<div class="field"><label class="field-label" for="series-kind">Which date is it?</label><select id="series-kind" data-series="dateKind">`
        +DATE_KINDS.map(k=>`<option value="${k}" ${d.dateKind===k?'selected':''}>${k}</option>`).join('')+'</select></div>'
        +`<div class="field"><label class="field-label" for="series-period">Period</label><select id="series-period" data-series="period">`
        +([['hour','hour, for dates and times'],['day','day'],['week','week, starting Monday (ISO 8601)'],['week-sunday','week, starting Sunday (epidemiological week)'],['month','month'],['weekday','day of the week'],['month-of-year','month of the year']] as const)
          .map(([v,t])=>`<option value="${v}" ${d.period===v?'selected':''}>${t}</option>`).join('')+'</select></div>'
        +(d.source==='table'?'':pick('series-weight','Cases per record (optional)','weightField','',true))
        // SPLIT BY A COLUMN (experiment 210): each period counted for each of its values, for a curve stacked by them.
        // A CASE IN SEVERAL ROWS, one per recorded source, counted once (MERS, 2026-11-15).
        +(d.rowAsCase?pick('series-case','Each case is named in (optional)','caseId','',true):'')
        +(d.source==='table'&&!d.rowAsCase?'':pick('series-split','Count each value of (optional)','splitBy','',true));
      return {settings,preview:seriesPreview(kit,nodeId,d,esc),
        // SAID, NOT BLOCKED: the input is chosen before it is connected, and the columns come with the connection; the
        // run refuses a missing date, as it did before (the Sierra Leone manual, 2026-11-12).
        ...(d.dateField?{}:{message:{tone:'warning' as const,text:'Choose the date column, once the records are connected.'}})};
    },
    wire:(root,d,redraw)=>{
      root.querySelector<HTMLSelectElement>('#series-input')?.addEventListener('change',e=>{
        const v=(e.target as HTMLSelectElement).value;
        if(v==='table'||v==='table-case'){d.source='table';delete d.weightField;if(v==='table-case')d.rowAsCase=true;else{delete d.rowAsCase;delete d.splitBy;delete d.caseId;}}
        else{delete d.source;delete d.rowAsCase;delete d.caseId;}redraw();});
      root.querySelectorAll<HTMLInputElement&HTMLSelectElement>('[data-series]').forEach(el=>el.addEventListener('change',()=>{
        const key=el.dataset.series as 'dateField'|'weightField'|'dateKind'|'period'|'splitBy'|'caseId',value=el.value.trim();
        if(key==='weightField'||key==='splitBy'||key==='caseId'){if(value)d[key]=value;else delete d[key];}
        else (d as unknown as Record<string,string>)[key]=value;redraw();}));
    },
    apply:d=>{kit.change(w=>{const target=w.nodes.find(x=>x.id===nodeId);if(target?.type!=='case_series')return;const was=target.params.source;target.params=d;
      if((was||'points')!==(d.source||'points'))w.edges=w.edges.filter(e=>e.to!==nodeId);});},
  },esc);
}
/** RATE'S DIALOG (experiment 186): every setting on a draft, and the rates this draft gives, before Apply. */
function openRateConfig(kit:SeriesRateKit,nodeId:string){
  const esc=kit.esc,node=kit.workflow().nodes.find(x=>x.id===nodeId) as WorkflowNode<'rate'>|undefined;if(!node)return;
  type Draft=import('./types.js').ParamsByType['rate'];
  openConfigDialog<Draft>({
    id:'rate-config',widget:'Rate with a denominator',step:node.params.label||kit.title('rate'),draft:structuredClone(node.params),
    sections:draft=>{
      const arriving=draft.source==='table'?kit.rateColumns(nodeId):{columns:[]},table=arriving.table,columns=arriving.columns;
      const wide=draft.source==='table'&&draft.tableForm==='wide';
      const measures=draft.source==='table'&&!wide&&table?[...new Set(table.rows.map(r=>r.key[draft.measureKey||'measure']??''))].filter(Boolean):[];
      // A column chosen from a list where the columns are known; typed where they are not, as a point's attribute is.
      const pick=(id:string,label:string,key:keyof Draft,offered:string[],placeholder:string,optional=false)=>{
        const held=String(draft[key]??'');
        return `<div class="field"><label class="field-label" for="${id}">${label}</label>`+(offered.length
          ?`<select id="${id}" data-rate="${String(key)}"><option value="">${optional?'Not used':'Choose…'}</option>`
            +offered.map(c=>`<option value="${esc(c)}" ${c===held?'selected':''}>${esc(c)}</option>`).join('')+'</select>'
          :`<input id="${id}" data-rate="${String(key)}" maxlength="80" value="${esc(held)}" placeholder="${esc(placeholder)}">`)+'</div>';};
      const text=(id:string,label:string,key:keyof Draft,placeholder:string)=>`<div class="field"><label class="field-label" for="${id}">${label}</label>`
        +`<input id="${id}" data-rate="${String(key)}" maxlength="80" value="${esc(String(draft[key]??''))}" placeholder="${esc(placeholder)}"></div>`;
      const fields=wide?columns:measures;
      const settings='<p class="description">Divides counted events by a declared population at risk.</p>'
        +`<div class="field"><label class="field-label" for="rate-source">Records arrive as</label><select id="rate-source">`
        +[['points','points, one per subject'],['table','a table']].map(([v,t])=>`<option value="${v}" ${(draft.source||'points')===v?'selected':''}>${t}</option>`).join('')+'</select></div>'
        +(draft.source==='table'
          ?`<div class="field"><label class="field-label" for="rate-form">The table holds</label><select id="rate-form">`
            +`<option value="long" ${!wide?'selected':''}>one row per measure, named in a key column</option>`
            +`<option value="wide" ${wide?'selected':''}>both numbers on each row, as columns</option></select></div>`
            +(wide?'':pick('rate-measure','Key column holding the measure names','measureKey',columns,'measure'))
          :'')
        +pick('rate-numerator',wide?'Numerator column (what is counted)':'Numerator (what is counted)','numeratorField',fields,'deaths')
        +pick('rate-denominator',wide?'Denominator column (units at risk)':'Denominator (units at risk)','denominatorField',fields,'population')
        +`<div class="field"><label class="field-label" for="rate-unit">The denominator counts</label><select id="rate-unit" data-rate="denominatorUnit">`
        +['people','houses','households','person-time','other'].map(u=>`<option value="${u}" ${draft.denominatorUnit===u?'selected':''}>${u}</option>`).join('')+'</select></div>'
        +`<div class="field"><label class="field-label" for="rate-kind">Kind</label><select id="rate-kind" data-rate="rateKind">`
        +['proportion','ratio'].map(k=>`<option value="${k}" ${draft.rateKind===k?'selected':''}>${k==='proportion'?'proportion — numerator is part of the denominator':'ratio — events per unit, may exceed one'}</option>`).join('')+'</select></div>'
        +`<div class="field"><label class="field-label" for="rate-multiplier">Per</label><select id="rate-multiplier" data-rate-number="multiplier">`
        +[1,100,1000,10000,100000].map(m=>`<option value="${m}" ${draft.multiplier===m?'selected':''}>${m.toLocaleString()}</option>`).join('')+'</select></div>'
        +pick('rate-group','Group by (optional)','groupBy',draft.source==='table'?columns:[],'distance_m',true)
        +`<div class="field"><label class="field-label" for="rate-band">Band width for a numeric grouping (optional)</label><input id="rate-band" type="number" min="0" data-rate-number="bandWidth" value="${draft.bandWidth??''}"></div>`
        +`<div class="field"><label class="field-label" for="rate-minimum">Smallest denominator that gets a rate</label><input id="rate-minimum" type="number" min="0" data-rate-number="minimumDenominator" value="${draft.minimumDenominator}"></div>`
        +text('rate-period','Period the numerator covers','numeratorPeriod','1854 outbreak')
        +text('rate-vintage','Vintage of the denominator','denominatorVintage','1855 map')
        +'';
      if(!draft.numeratorField||!draft.denominatorField)return {settings,preview:'<p class="muted">Choose the numerator and the denominator to see the rates.</p>'};
      if(!table)return {settings,preview:'<p class="muted">The rates are computed when the workflow runs'
        +(draft.source==='table'?', and shown here once the table can be read without a run.':'.')+'</p>'};
      try{
        const records=wide?fromWideTable(table,[draft.numeratorField,draft.denominatorField,draft.groupBy??'']):fromTable(table,draft.measureKey||'measure');
        const rates=computeRate(records,draft);
        const preview='<table class="relate-shares"><thead><tr><th>Group</th><th>Numerator</th><th>Denominator</th>'
          +`<th>Per ${draft.multiplier.toLocaleString()}</th></tr></thead><tbody>`
          +rates.rows.map(r=>`<tr><th scope="row">${esc(r.label)}</th><td>${r.numerator.toLocaleString()}</td><td>${r.denominator.toLocaleString()}</td>`
            +`<td${r.rate===null?' class="profile-flag"':''}>${r.rate===null?esc(r.reason??'no rate'):r.rate.toLocaleString(undefined,{maximumFractionDigits:2})}</td></tr>`).join('')
          +'</tbody></table>';
        return {settings,preview};
      }catch(error){return {settings,message:{tone:'refusal' as const,text:error instanceof Error?error.message:String(error)},blocked:true};}
    },
    wire:(root,draft,redraw)=>{
      const on=(selector:string,fn:(el:HTMLInputElement&HTMLSelectElement)=>void)=>
        root.querySelectorAll<HTMLInputElement&HTMLSelectElement>(selector).forEach(el=>el.addEventListener('change',()=>{fn(el);redraw();}));
      on('#rate-source',el=>{draft.source=el.value==='table'?'table':'points';if(draft.source==='points')delete draft.tableForm;});
      on('#rate-form',el=>{draft.tableForm=el.value==='wide'?'wide':'long';});
      on('[data-rate]',el=>{const key=el.dataset.rate!;const v=el.value.trim();
        if(key==='groupBy'||key==='measureKey'){if(v)(draft as unknown as Record<string,string>)[key]=v;else delete (draft as unknown as Record<string,unknown>)[key];}
        else (draft as unknown as Record<string,string>)[key]=v;});
      on('[data-rate-number]',el=>{(draft as unknown as Record<string,number|undefined>)[el.dataset.rateNumber!]=el.value===''?undefined:Number(el.value);});
    },
    apply:draft=>{
      kit.change(w=>{const target=w.nodes.find(x=>x.id===nodeId);if(target?.type!=='rate')return;const was=target.params.source??'points';target.params=draft;
        // Points and a table are not the same shape, so changing which one disconnects what was wired.
        if((draft.source??'points')!==was)w.edges=w.edges.filter(e=>e.to!==nodeId);});
    },
  },esc);
}


const configure='<div class="inspector-actions"><button id="configure-step" class="button primary">Configure\u2026</button></div>';
const result=(kit:SeriesRateKit,id:string,ran:string)=>{const why=kit.unfinished(id);
  return `<p class="standard-result${why?' standard-result-warning':''}">${kit.esc(why?`The last run could not compute this step: ${why}`:ran)}</p>`;};
export const rateInspector:OwnInspector<'rate'>={
  markup:(n,kit)=>{const k=kit as SeriesRateKit,p=n.params;
    return kit.section('Name',kit.name('rate-label',p.label||k.title('rate')))+kit.section('Inputs',kit.inputs(n))
      +kit.section('Settings',`<p class="standard-sentence">${kit.esc(rateSentence(p))}</p>`+configure)
      +kit.section('Result',result(k,n.id,k.method(n.id)!==undefined?'Computed in the last run: the rates are in its table.':'Not run yet.'));},
  wire:(n,kit,root)=>{root.querySelector('#configure-step')?.addEventListener('click',()=>openRateConfig(kit as SeriesRateKit,n.id));},
};
export const caseSeriesInspector:OwnInspector<'case_series'>={
  markup:(n,kit)=>{const k=kit as SeriesRateKit,p=n.params,method=k.method(n.id);
    return kit.section('Name',kit.name('series-label',p.label||k.title('case_series')))+kit.section('Inputs',kit.inputs(n))
      +kit.section('Settings',`<p class="standard-sentence">${kit.esc(seriesSentence(p))}</p>`+configure)
      +kit.section('Result',result(k,n.id,method?method.split('. ')[0]+'.':'Not run yet.')
        +(k.feedsAnything(n.id)?'':'<div class="inspector-actions"><button id="add-series-chart" class="button small">\uff0b Add epidemic curve</button></div>'));},
  wire:(n,kit,root)=>{const k=kit as SeriesRateKit;
    root.querySelector('#configure-step')?.addEventListener('click',()=>openSeriesConfig(k,n.id));
    root.querySelector('#add-series-chart')?.addEventListener('click',()=>k.addCurve(n));},
};
