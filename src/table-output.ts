import {presentValue,headingMarks,noteNumbers,type TablePresentation} from './table-presentation.js';
import {crsIRIFromName} from './metric-crs.js';
import type {NodeSpec,WorkflowNode,PointInput,Escape,Scalar} from './types.js';
import type {CoverageValue,TableValue,PointRow,CoverageRow,Receipt} from './results.js';
export type TableInputs={points:PointInput};
import {pointLayers,layerRecords,layerSummary} from './point-layers.js';
import {attributeLiteral} from './attribute-schema.js';
import {defaultSpatialReference} from './spatial-reference.js';
import {relationLabel} from './spatial-coverage.js';
import {CRS84} from './study-area.js';

export const newTableOutput=():NodeSpec<'table_output'>=>({type:'table_output',params:{label:'Point table'}});
export function tableOutput(node:WorkflowNode<'table_output'>,inputs:TableInputs,runId:string):{value:TableValue;receipt:Receipt}{
  const layers=pointLayers(inputs.points);
  const value:TableValue={
    kind:'point-table',rows:layerRecords(layers).map(({feature,...identity})=>({...identity,name:feature.properties.name,attributes:structuredClone(feature.properties),coordinates:structuredClone(feature.geometry?.coordinates||null)})),
    pointLayers:layerSummary(layers),spatialReference:structuredClone(layers[0]?.spatialReference||defaultSpatialReference()),centers:[],
  };
  value.pointTable=true;
  const activity=`<urn:fieldwork:run:${runId}:table:${node.id}>`,entity=`<urn:fieldwork:run:${runId}:table-result:${node.id}>`;
  let facts='@prefix fw: <urn:fieldwork:>.\n@prefix prov: <http://www.w3.org/ns/prov#>.\n@prefix geo: <http://www.opengis.net/ont/geosparql#>.\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n';
  facts+=`${activity} a fw:TableView, prov:Activity; prov:generated ${entity}; prov:used ${value.pointLayers.map(l=>`<urn:fieldwork:source:${l.sourceNodeId}>`).join(', ')}.\n${entity} a prov:Entity; rdfs:label ${JSON.stringify(node.params.label)}; prov:wasGeneratedBy ${activity}.\n`;
  // The union across the table, so a record's silence about a field is a fact about that record
  // rather than an absence of facts.
  const columnKeys=[...new Set(value.rows.flatMap(row=>Object.keys(row.attributes||{})))];
  for(const row of value.rows){
    const record=`<urn:fieldwork:record:${row.sourceNodeId}:${encodeURIComponent(String(row.recordId))}>`,geometry=`<urn:fieldwork:record:${row.sourceNodeId}:${encodeURIComponent(String(row.recordId))}:geometry>`;
    facts+=`${record} a geo:Feature; rdfs:label ${JSON.stringify(row.name)}; <http://purl.org/dc/terms/isPartOf> <urn:fieldwork:source:${row.sourceNodeId}>.\n`;
    // The WKT names the frame the coordinates are actually in. It was hardcoded to CRS84, which
    // was true while nothing could project; once `reproject` can hand this view easting and
    // northing, a fixed CRS84 would label metres as degrees -- the same defect the receipts were
    // cleared of on 2026-10-13, reintroduced at the last step of the chain.
    if(row.coordinates)facts+=`${record} geo:hasGeometry ${geometry}.\n${geometry} a geo:Geometry; geo:asWKT ${JSON.stringify('<'+(crsIRIFromName(value.spatialReference?.geometryCRS??'')??CRS84)+'> POINT ('+row.coordinates.join(' ')+')')}^^geo:wktLiteral.\n`;
    // EVERY COLUMN, FOR EVERY RECORD. The loop ran over the attributes a record HAS, so a field a
    // record does not have was silent in the receipt while the table showed a confident phrase for
    // it. The screen asserted more than the provenance did. Absence is now asserted, and the two
    // kinds are kept apart: `fw:fieldAbsent` where the record has no such field, `fw:missingValue`
    // where it has the field and left it empty.
    for(const key of columnKeys){
      if(key==='name')continue;
      const held=Object.hasOwn(row.attributes,key);
      const v=held?row.attributes[key]:undefined;
      const body=!held?'fw:fieldAbsent true'
        :(v===null||v==='')?'fw:missingValue true'
        :'<http://www.w3.org/1999/02/22-rdf-syntax-ns#value> '+attributeLiteral(v as Scalar,row.attributeTypes?.[key]);
      facts+=`${record} fw:attribute [ fw:fieldKey ${JSON.stringify(key)}; ${body} ].\n`;
    }
  }
  return {value,receipt:{nodeId:node.id,kind:'presentation',input:facts,facts,rules:'',conclusions:[],method:'Tabular presentation of source records; no new spatial classification or exclusion'}};
}

/** AN ABSENT VALUE IS NOT A VALUE. This returned the words "Not supplied", which a reader cannot
 *  tell from a source that contains those words, which sorts and matches the row filter as if it
 *  were data, and which says the same thing about a field the record does not have as about a
 *  field it has and left empty. The practitioner, 2026-10-21: *"was the data missing or field
 *  empty value and we supplied that value as a replacement? The data quality implications are
 *  enormous even if the table were an output. It's also a provenance issue."*
 *
 *  The cell is a dash, read aloud as "no value" and drawn apart from the data, unless the table's presentation says
 *  otherwise (Table 0.15.0). How many are absent is a property of the COLUMN and belongs in the quality report. */
const display=(v:unknown)=>v===null||v===undefined||v===''?null:String(v);
const action=(r:Partial<CoverageRow>)=>r.excluded?'Excluded':r.decision==='Review'?'Review required':r.decision==='Accept'?'Included':'';
export const TABLE_PAGE_SIZE=100,ATTRIBUTE_PAGE_SIZE=12;

/** Ranking a result table by one of its columns.
 *
 *  `snap_to_network` has claimed since 2026-10-14 that its displacement is "a point attribute a
 *  practitioner can map, sort and argue with", and on 2026-10-17 the practitioner's decomposition
 *  of "which clinic is furthest from a road" showed that sorting existed nowhere in the
 *  application: these tables offered a filter box and no order. The practitioner's own framing --
 *  *"typically in programming one could use a loop to compare different lengths, or given a data
 *  set of lengths sort them short to long"* -- is exactly right about the mechanism, and the
 *  mechanism was never the hard part.
 *
 *  What needs deciding is what an order means over cells that are not all comparable, because a
 *  result table holds `Scalar|null` and nothing promises a column is numeric:
 *
 *  - **The comparison is chosen per column, from the values present.** Every known value a number
 *    makes it a numeric column. Anything else is compared as text under
 *    `localeCompare(..., {numeric:true})`, which still puts "3" before "10" without claiming a
 *    column with mixed types in it is numeric. A column where some rows read `3` and others `'3'`
 *    is the data quality problem [117](../docs/experiments/117-data-quality.md) exists to surface,
 *    and a sort that quietly coerced them would hide it at the moment the practitioner is looking
 *    straight at it.
 *  - **Values that are not there are held at the end, in both directions, and counted.** "Farthest
 *    from the road" must not be answered by a record whose distance was never measured. Reversing
 *    the order reverses the records that have values; it does not promote an absence to the top.
 */
export type SortDirection='ascending'|'descending';
export interface TableSort {column:string; direction:SortDirection}
const known=(v:Scalar|undefined):v is Exclude<Scalar,null>=>v!==null&&v!==undefined&&v!=='';
const rank=(v:Exclude<Scalar,null>)=>typeof v==='boolean'?(v?1:0):v;
/** True when every value present is a number, so the column can be ordered by magnitude. */
export const isNumericColumn=(values:readonly (Scalar|undefined)[])=>{
  const present=values.filter(known);
  return present.length>0&&present.every(v=>typeof v==='number');
};
export function sortRows<T>(rows:readonly T[],read:(row:T)=>Scalar|undefined,direction:SortDirection):{sorted:T[];unknownCount:number}{
  const numeric=isNumericColumn(rows.map(read)),sign=direction==='ascending'?1:-1;
  const withValue:T[]=[],without:T[]=[];
  for(const row of rows)(known(read(row))?withValue:without).push(row);
  withValue.sort((a,b)=>{
    const x=rank(read(a) as Exclude<Scalar,null>),y=rank(read(b) as Exclude<Scalar,null>);
    return sign*(numeric||typeof x!=='string'||typeof y!=='string'
      ?(x<y?-1:x>y?1:0)
      :x.localeCompare(y,undefined,{numeric:true}));
  });
  return {sorted:[...withValue,...without],unknownCount:without.length};
}

interface TableColumn {key:string; label:string; read:(r:PointRow & Partial<CoverageRow>)=>Scalar|undefined}
export function pointTableColumns(output:TableValue|CoverageValue,{attributePage=0}={}):{columns:TableColumn[];attributeKeys:string[]}{
  const attributeKeys=[...new Set(output.rows.flatMap(r=>Object.keys(r.attributes).filter(k=>k!=='name')))];
  const reviewed=output.kind==='spatial-coverage';
  return {attributeKeys,columns:[
    {key:'layerLabel',label:'Layer',read:r=>r.layerLabel},
    {key:'recordId',label:'Record ID',read:r=>r.recordId},
    {key:'name',label:'Name',read:r=>r.name},
    {key:'longitude',label:'Longitude (°)',read:r=>r.coordinates?.[0]??null},
    {key:'latitude',label:'Latitude (°)',read:r=>r.coordinates?.[1]??null},
    ...(reviewed?[
      {key:'relation',label:'Spatial relation',read:(r:PointRow & Partial<CoverageRow>)=>r.relation?relationLabel(r.relation):null},
      {key:'decision',label:'Review decision',read:(r:PointRow & Partial<CoverageRow>)=>action(r)||null},
      {key:'exclusionReason',label:'Exclusion reason',read:(r:PointRow & Partial<CoverageRow>)=>r.exclusionReason??null},
    ]:[]),
    ...attributeKeys.slice(attributePage*ATTRIBUTE_PAGE_SIZE,(attributePage+1)*ATTRIBUTE_PAGE_SIZE)
      .map(k=>({key:`attribute:${k}`,label:k,read:(r:PointRow & Partial<CoverageRow>)=>r.attributes[k]})),
  ]};
}
export function pointTableMarkup(output:TableValue|CoverageValue,esc:Escape,{query='',page=0,attributePage=0,sort,present}:{query?:string;page?:number;attributePage?:number;sort?:TableSort;present?:TablePresentation}={}){
  const {columns,attributeKeys}=pointTableColumns(output,{attributePage});
  const metres=(output.spatialReference as {units?:string}|undefined)?.units==='metre';
  const needle=query.trim().toLowerCase(),filtered=output.rows.filter((r:PointRow & Partial<CoverageRow>)=>!needle||[r.name,r.recordId,r.layerLabel,r.sourceNodeId,...(r.coordinates||[]),r.relation?relationLabel(r.relation):'',action(r),r.exclusionReason||'',...Object.values(r.attributes).map(display)].join(' ').toLowerCase().includes(needle));
  const sorted=sort&&columns.some(c=>c.key===sort.column)?sortRows(filtered,columns.find(c=>c.key===sort.column)!.read,sort.direction):null;
  const ordered=sorted?sorted.sorted:filtered;
  const pages=Math.max(1,Math.ceil(ordered.length/TABLE_PAGE_SIZE));page=Math.min(page,pages-1);
  const shown=ordered.slice(page*TABLE_PAGE_SIZE,(page+1)*TABLE_PAGE_SIZE);
  const sortedColumn=sort?columns.find(c=>c.key===sort.column):undefined;
  const noted=noteNumbers(present,columns.map(c=>c.label));
  return {
    head:columns.map(c=>{
      const active=sort&&sort.column===c.key?sort.direction:'none';
      const next=active==='ascending'?'descending':'ascending';
      // A COLUMN OF NUMBERS IS HEADED ON THE RIGHT, over its numbers (Table 0.15.0).
      const numbers=shown.some(r=>{const v=c.read(r);return typeof v==='number';});
      return `<th scope="col" aria-sort="${active}"${numbers?' class="number"':''}><button type="button" class="column-sort" data-table-sort="${esc(c.key)}" data-table-direction="${next}">${esc(c.label)}${headingMarks(c.label,present,esc,noted)}<span aria-hidden="true" class="sort-mark">${active==='ascending'?'▲':active==='descending'?'▼':''}</span></button></th>`;
    }).join(''),
    body:shown.length?shown.map((r:PointRow & Partial<CoverageRow>)=>`<tr tabindex="0" data-place="${esc(r.id)}">${columns.map(c=>{
      const shownValue=display(c.read(r));
      // `data-absent` says WHICH kind of absence, because they call for different work: a field
      // the record does not have at all, and a field it has and left empty.
      const absence=c.read(r)===undefined?'missing':'empty';
      // WRITTEN AS THE TABLE'S PRESENTATION SAYS (Table 0.15.0): an attribute's precision and separators; a name, an
      // identifier or a coordinate keeps its own digits and only aligns as a number.
      // A COORDINATE TO ONE PRECISION DOWN ITS COLUMN: six places in degrees (about 0.1 m), one in metres.
      const raw=c.read(r),coordinate=(c.key==='longitude'||c.key==='latitude')&&typeof raw==='number';
      const v=coordinate?{html:esc((raw as number).toFixed(metres?1:6)),number:true,absent:false}
        // THE NUMBER ITSELF, where it is one (2026-11-28): `display` writes it as text, and text is shown as written, so
        // decimal places and small-count hiding never reached Results' point table.
        :presentValue(typeof raw==='number'?raw:shownValue,c.label,present,esc,{measure:c.key.startsWith('attribute:')});
      return v.absent?`<td data-absent="${absence}" class="absent-cell">${v.html}</td>`:`<td${v.number?' data-number':''}>${v.html}</td>`;
    }).join('')}</tr>`).join(''):`<tr><td colspan="${columns.length}">${output.rows.length?'No matching records.':'No point records in this input.'}</td></tr>`,
    controls:`<div class="table-page-group"><button class="button small" data-table-page="${page-1}" ${page===0?'disabled':''}>Previous rows</button><span role="status">${ordered.length?`${page*TABLE_PAGE_SIZE+1}–${Math.min((page+1)*TABLE_PAGE_SIZE,ordered.length)}`:'0'} of ${ordered.length} records</span><button class="button small" data-table-page="${page+1}" ${page+1>=pages?'disabled':''}>Next rows</button></div>`
      +(sorted&&sortedColumn?`<p class="muted" role="status">Ordered by ${esc(sortedColumn.label)}, ${sort!.direction==='ascending'?'lowest':'highest'} first${sorted.unknownCount?`. ${sorted.unknownCount} record${sorted.unknownCount===1?'':'s'} with no value for this column held at the end, in either direction.`:'.'}</p>`:'')
      +(attributeKeys.length>ATTRIBUTE_PAGE_SIZE?`<div class="table-page-group"><button class="button small" data-table-fields="${attributePage-1}" ${attributePage===0?'disabled':''}>Previous attributes</button><span>Attributes ${attributePage*ATTRIBUTE_PAGE_SIZE+1}–${Math.min((attributePage+1)*ATTRIBUTE_PAGE_SIZE,attributeKeys.length)} of ${attributeKeys.length}</span><button class="button small" data-table-fields="${attributePage+1}" ${(attributePage+1)*ATTRIBUTE_PAGE_SIZE>=attributeKeys.length?'disabled':''}>Next attributes</button></div>`:''),
  };
}
export function pointTableEvidence(row:PointRow,dirty:boolean,esc:Escape){return `<div class="inspector-body"><span class="inspector-section">Point record ${dirty?'· previous run':''}</span><h2>${esc(row.name)}</h2><p>${esc(row.layerLabel)} · ${esc(row.recordId)}</p><p>${row.coordinates?'Longitude, latitude: '+row.coordinates.map(esc).join(', '):'No coordinates supplied'}</p><p class="muted">Attributes as the source gave them. Nothing here is a judgement about the record.</p>${Object.entries(row.attributes).map(([k,v])=>`<div class="detail-row"><span>${esc(k)}</span><strong>${esc(display(v))}</strong></div>`).join('')}</div>`;}
