/** THE COOPERATIVE TRAINING MISSION'S DATA MODEL (experiment 233, second spike, 2026-11-28).
 *
 *  The same tables, read rules and functions as docs/experiments/233/game-model.sql, in TypeScript, so a unit test can
 *  say what each role can and cannot read and what ending a turn does. A draft: nothing in the application imports it,
 *  and nothing has been created in Supabase.
 *
 *  Each read rule here mirrors one row-level security policy there, and each function mirrors the SQL function of the
 *  same name. The server's clock is the `now` argument; the caller is `userId`, as Supabase's auth.uid(). */

export const TABLES=['mission','mission_secret','team','role','membership','turn','turn_end','evidence','release','move','resolution'] as const;
export type Table=typeof TABLES[number];
/** Refuse update and delete in the SQL (a trigger on each). Here their rows are frozen. */
export const APPEND_ONLY=['turn','turn_end','release','move','resolution'] as const satisfies readonly Table[];

export type MissionStatus='setup'|'in_play'|'debrief'|'closed';
export type RoleKind='facilitator'|'player';
export type IdentityBasis='declared'|'attested';

export interface Mission {id:string;title:string;status:MissionStatus;turnCount:number;currentTurn:number;
  templateRepository:string;templateCommit:string;kernelSha256:string;createdBy:string;createdAt:string}
export interface MissionSecret {missionId:string;seed:number;modelParameters:unknown;answerKey:unknown}
export interface Team {id:string;missionId:string;name:string}
export interface Role {id:string;missionId:string;key:string;label:string;kind:RoleKind}
export interface Membership {id:string;missionId:string;teamId:string|null;roleId:string;roleKind:RoleKind;userId:string;
  githubLogin?:string;identityBasis:IdentityBasis;joinedAt:string}
export interface Turn {missionId:string;number:number;openedAt:string}
export interface TurnEnd {missionId:string;turnNumber:number;endedAt:string;endedByMembership:string;requestId:string}
export interface Evidence {id:string;missionId:string;forTurn:number;teamId:string|null;roleId:string|null;label:string;path:string;sha256:string}
export interface Release {missionId:string;evidenceId:string;turnNumber:number;releasedAt:string}
export type MoveKind='proposal'|'decision';
export interface Move {id:string;seq:number;missionId:string;teamId:string;turnNumber:number;membershipId:string;roleId:string;userId:string;
  kind:MoveKind;action:string;reason?:string;evidenceRef?:string;evidenceSha256?:string;reconsiderIf?:string;madeAt:string;late:boolean}
export interface Resolution {missionId:string;turnNumber:number;teamId:string;decisionMoveId:string|null;resolvedAt:string}

export interface Rows {mission:Mission;mission_secret:MissionSecret;team:Team;role:Role;membership:Membership;turn:Turn;turn_end:TurnEnd;
  evidence:Evidence;release:Release;move:Move;resolution:Resolution}
export type GameState={[T in Table]:Rows[T][]};
export const emptyState=():GameState=>({mission:[],mission_secret:[],team:[],role:[],membership:[],turn:[],turn_end:[],evidence:[],
  release:[],move:[],resolution:[]});

/** A refusal, with the SQLSTATE the SQL raises for it. */
export class GameRefusal extends Error {
  constructor(readonly code:'42501'|'55000'|'40001'|'23514',message:string){super(message);this.name='GameRefusal';}
}

// ── Who the caller is in a mission (game.is_member, game.is_facilitator, game.player_team, game.player_role) ────────

const membershipOf=(s:GameState,missionId:string,userId:string)=>s.membership.find(x=>x.missionId===missionId&&x.userId===userId);
export const isMember=(s:GameState,m:string,u:string)=>!!membershipOf(s,m,u);
export const isFacilitator=(s:GameState,m:string,u:string)=>membershipOf(s,m,u)?.roleKind==='facilitator';
export const playerTeam=(s:GameState,m:string,u:string)=>{const membership=membershipOf(s,m,u);return membership?.roleKind==='player'?membership.teamId:null;};
export const playerRole=(s:GameState,m:string,u:string)=>{const membership=membershipOf(s,m,u);return membership?.roleKind==='player'?membership.roleId:null;};
const inDebrief=(s:GameState,m:string)=>s.mission.some(x=>x.id===m&&(x.status==='debrief'||x.status==='closed'));
/** game.player_can_read_evidence: released, for their team or every team, for their role or every role. */
export function playerCanReadEvidence(s:GameState,u:string,evidenceId:string){
  const ev=s.evidence.find(e=>e.id===evidenceId);
  if(!ev||!s.release.some(r=>r.evidenceId===ev.id))return false;
  const team=playerTeam(s,ev.missionId,u),role=playerRole(s,ev.missionId,u);
  return team!==null&&(ev.teamId===null||ev.teamId===team)&&(ev.roleId===null||ev.roleId===role);
}

// ── Each role's read rules: one per table, one per policy in the SQL ──────────────────────────────────────────────

export const READ_RULES:{[T in Table]:(s:GameState,u:string,row:Rows[T])=>boolean}={
  mission:(s,u,r)=>isMember(s,r.id,u),
  mission_secret:(s,u,r)=>isFacilitator(s,r.missionId,u)||(isMember(s,r.missionId,u)&&inDebrief(s,r.missionId)),
  team:(s,u,r)=>isFacilitator(s,r.missionId,u)||r.id===playerTeam(s,r.missionId,u),
  role:(s,u,r)=>isMember(s,r.missionId,u),
  membership:(s,u,r)=>isFacilitator(s,r.missionId,u)||(r.teamId!==null&&r.teamId===playerTeam(s,r.missionId,u)),
  turn:(s,u,r)=>isMember(s,r.missionId,u),
  turn_end:(s,u,r)=>isMember(s,r.missionId,u),
  evidence:(s,u,r)=>isFacilitator(s,r.missionId,u)||playerCanReadEvidence(s,u,r.id),
  release:(s,u,r)=>isFacilitator(s,r.missionId,u)||playerCanReadEvidence(s,u,r.evidenceId),
  move:(s,u,r)=>isFacilitator(s,r.missionId,u)||r.teamId===playerTeam(s,r.missionId,u),
  resolution:(s,u,r)=>isFacilitator(s,r.missionId,u)||r.teamId===playerTeam(s,r.missionId,u),
};

/** Everything `userId` can read, table by table: what a select through row-level security would return. */
export function readable(s:GameState,userId:string):GameState{
  const out=emptyState();
  for(const table of TABLES)(out[table] as unknown[])=(s[table] as Rows[typeof table][]).filter(row=>(READ_RULES[table] as (s:GameState,u:string,r:unknown)=>boolean)(s,userId,row));
  return out;
}

// ── Writing (game.start_mission, game.submit_move, game.end_turn) ──────────────────────────────────────────────────

const HEX64=/^[0-9a-f]{64}$/;
/** The SQL's evidence_ref check: a Fieldwork IRI, such as a run's receipt, or an https address. */
export const EVIDENCE_REF=/^(urn:fieldwork:|https:\/\/)[^\s<>"{}|\\^`]+$/;
const append=<T extends Table>(s:GameState,table:T,row:Rows[T])=>{(s[table] as Rows[T][]).push(Object.freeze(row) as Rows[T]);return row;};
const missionOf=(s:GameState,id:string)=>{const m=s.mission.find(x=>x.id===id);if(!m)throw new GameRefusal('55000','No such mission');return m;};
const releaseFor=(s:GameState,missionId:string,turn:number,at:string)=>{
  for(const e of s.evidence.filter(e=>e.missionId===missionId&&e.forTurn===turn))
    append(s,'release',{missionId,evidenceId:e.id,turnNumber:turn,releasedAt:at});
};

export function startMission(s:GameState,userId:string,missionId:string,now:string){
  if(!isFacilitator(s,missionId,userId))throw new GameRefusal('42501','Only the mission\'s facilitator can start it');
  const m=missionOf(s,missionId);
  if(m.status!=='setup')return {openedTurn:1,replayed:true};
  append(s,'turn',{missionId,number:1,openedAt:now});
  releaseFor(s,missionId,1,now);
  m.status='in_play';m.currentTurn=1;
  return {openedTurn:1,replayed:false};
}

/** What a caller sends with a move. Membership, role, team and time are never among them. */
export interface MoveRequest {missionId:string;turn:number;kind:MoveKind;action:string;reason?:string;evidenceRef?:string;
  evidenceSha256?:string;reconsiderIf?:string}

let nextSeq=1;
export function submitMove(s:GameState,userId:string,request:MoveRequest,now:string,id:string=crypto.randomUUID()):Move{
  const membership=membershipOf(s,request.missionId,userId);
  if(!membership||membership.roleKind!=='player'||!membership.teamId)throw new GameRefusal('42501','Only a player membershiped in this mission can make a move');
  const m=missionOf(s,request.missionId);
  if(m.status==='setup'||m.status==='closed')throw new GameRefusal('55000','The mission is not in play');
  if(!s.turn.some(t=>t.missionId===m.id&&t.number===request.turn))throw new GameRefusal('55000',`Turn ${request.turn} has not opened`);
  const filled=(v?:string)=>!!v&&v.trim().length>0;
  if(!filled(request.action))throw new GameRefusal('23514','A move needs an action');
  if(request.evidenceRef!==undefined&&!EVIDENCE_REF.test(request.evidenceRef))throw new GameRefusal('23514','The evidence must be a Fieldwork IRI or an https address');
  if(request.evidenceSha256!==undefined&&!HEX64.test(request.evidenceSha256))throw new GameRefusal('23514','The evidence digest must be a SHA-256 in hex');
  if(request.kind==='decision'&&!(filled(request.reason)&&request.evidenceRef&&request.evidenceSha256&&filled(request.reconsiderIf)))
    throw new GameRefusal('23514','A decision needs its reason, its evidence with a digest, and what would make the team reconsider');
  const late=s.turn_end.some(e=>e.missionId===m.id&&e.turnNumber===request.turn);
  return append(s,'move',{id,seq:nextSeq++,missionId:m.id,teamId:membership.teamId,turnNumber:request.turn,membershipId:membership.id,roleId:membership.roleId,
    userId:membership.userId,kind:request.kind,action:request.action,
    ...(request.reason!==undefined?{reason:request.reason}:{}),...(request.evidenceRef!==undefined?{evidenceRef:request.evidenceRef}:{}),
    ...(request.evidenceSha256!==undefined?{evidenceSha256:request.evidenceSha256}:{}),
    ...(request.reconsiderIf!==undefined?{reconsiderIf:request.reconsiderIf}:{}),
    madeAt:now,late});
}

export interface TurnEnded {endedTurn:number;openedTurn:number|null;replayed:boolean}

/** THE TURN-ENDING FUNCTION. See game.end_turn in the SQL for the reasoning; this is the same steps in the same order. */
export function endTurn(s:GameState,userId:string,request:{missionId:string;turn:number;requestId:string},now:string):TurnEnded{
  const membership=membershipOf(s,request.missionId,userId);
  if(!membership||membership.roleKind!=='facilitator')throw new GameRefusal('42501','Only the mission\'s facilitator can end a turn');
  const m=missionOf(s,request.missionId);
  const prior=s.turn_end.find(e=>e.missionId===m.id&&e.requestId===request.requestId);
  if(prior)return {endedTurn:prior.turnNumber,openedTurn:prior.turnNumber<m.turnCount?prior.turnNumber+1:null,replayed:true};
  if(m.status!=='in_play')throw new GameRefusal('55000','The mission is not in play');
  if(request.turn!==m.currentTurn)throw new GameRefusal('40001',`Turn ${request.turn} has already ended; the mission is at turn ${m.currentTurn}`);
  append(s,'turn_end',{missionId:m.id,turnNumber:request.turn,endedAt:now,endedByMembership:membership.id,requestId:request.requestId});
  for(const team of s.team.filter(t=>t.missionId===m.id)){
    const decision=s.move.filter(mv=>mv.missionId===m.id&&mv.teamId===team.id&&mv.turnNumber===request.turn&&mv.kind==='decision'&&!mv.late)
      .sort((a,b)=>b.madeAt.localeCompare(a.madeAt)||b.seq-a.seq)[0];
    append(s,'resolution',{missionId:m.id,turnNumber:request.turn,teamId:team.id,decisionMoveId:decision?.id??null,resolvedAt:now});
  }
  if(request.turn<m.turnCount){
    append(s,'turn',{missionId:m.id,number:request.turn+1,openedAt:now});
    releaseFor(s,m.id,request.turn+1,now);
    m.currentTurn=request.turn+1;
    return {endedTurn:request.turn,openedTurn:request.turn+1,replayed:false};
  }
  m.status='debrief';
  return {endedTurn:request.turn,openedTurn:null,replayed:false};
}

// ── Provenance ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** A mission's record in PROV-O, as `userId` can read it: built from `readable`, so a player's export holds only what
 *  their read rules allow. No term is coined. The vocabulary is what a run's receipts already use: prov:Activity with
 *  prov:startedAtTime and prov:endedAtTime (src/core.ts), prov:wasAttributedTo a GitHub account as a prov:Agent with
 *  fw:githubLogin and fw:identityBasis (src/study-area.ts), and <urn:fieldwork:sha256> for a digest. The secret, the
 *  people's account ids and the evidence's file paths are never written. */
export function missionProvenanceN3(state:GameState,userId:string,missionId:string):string{
  const s=readable(state,userId),m=s.mission.find(x=>x.id===missionId);
  if(!m)return '';
  const base=`urn:fieldwork:mission:${m.id}`,iri=(part:string)=>`<${base}:${part}>`,lit=JSON.stringify;
  const time=(t:string)=>`${lit(t)}^^xsd:dateTime`;
  const memberships=new Map(s.membership.map(x=>[x.id,x]));
  const roles=new Map(s.role.filter(r=>r.missionId===m.id).map(r=>[r.id,r]));
  const agent=(membershipId:string)=>{const membership=memberships.get(membershipId);return membership?.githubLogin?`<https://github.com/${membership.githubLogin}>`:iri('membership:'+membershipId);};
  const association=(membershipId:string,roleId:string)=>{const role=roles.get(roleId);
    return `prov:wasAssociatedWith ${agent(membershipId)}; prov:qualifiedAssociation [ a prov:Association; prov:agent ${agent(membershipId)}`
      +(role?`; prov:hadRole ${iri('role:'+role.key)}`:'')+' ]';};
  let n3='@prefix prov: <http://www.w3.org/ns/prov#>.\n@prefix dcterms: <http://purl.org/dc/terms/>.\n'
    +'@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n@prefix fw: <urn:fieldwork:>.\n';
  const template=`<${m.templateRepository}/tree/${m.templateCommit}>`,kernel=`<urn:fieldwork:kernel:sha256:${m.kernelSha256}>`;
  n3+=`<${base}> a prov:Activity; dcterms:title ${lit(m.title)}; prov:used ${template}, ${kernel}.\n`;
  n3+=`${template} a prov:Plan, prov:Entity; dcterms:source <${m.templateRepository}>; dcterms:hasVersion ${lit(m.templateCommit)}.\n`;
  n3+=`${kernel} a prov:Entity; <urn:fieldwork:sha256> ${lit(m.kernelSha256)}.\n`;
  for(const role of roles.values())n3+=`${iri('role:'+role.key)} a prov:Role; rdfs:label ${lit(role.label)}.\n`;
  for(const membership of s.membership.filter(x=>x.missionId===m.id)){
    n3+=`${agent(membership.id)} a prov:Agent, prov:Person`;
    if(membership.githubLogin)n3+=`; fw:githubLogin ${lit(membership.githubLogin)}; fw:identityBasis ${lit(membership.identityBasis)}`;
    n3+='.\n';
  }
  const ends=new Map(s.turn_end.filter(e=>e.missionId===m.id).map(e=>[e.turnNumber,e]));
  for(const turn of s.turn.filter(t=>t.missionId===m.id)){
    const end=ends.get(turn.number);
    n3+=`${iri('turn:'+turn.number)} a prov:Activity; dcterms:isPartOf <${base}>; prov:startedAtTime ${time(turn.openedAt)}`
      +(end?`; prov:endedAtTime ${time(end.endedAt)}`:'')+'.\n';
  }
  const releases=s.release.filter(r=>r.missionId===m.id);
  for(const ev of s.evidence.filter(e=>e.missionId===m.id)){
    const released=releases.find(r=>r.evidenceId===ev.id);
    n3+=`${iri('evidence:'+ev.id)} a prov:Entity; rdfs:label ${lit(ev.label)}; <urn:fieldwork:sha256> ${lit(ev.sha256)}`
      +(released?`; dcterms:available ${time(released.releasedAt)}`:'')+'.\n';
  }
  // A turn's snapshot: the evidence this reader saw released at its start.
  const snapshots=new Set(releases.map(r=>r.turnNumber));
  for(const turn of snapshots){
    const members=releases.filter(r=>r.turnNumber===turn).map(r=>iri('evidence:'+r.evidenceId));
    n3+=`${iri('snapshot:'+turn)} a prov:Collection, prov:Entity; prov:hadMember ${members.join(', ')}.\n`;
  }
  for(const mv of s.move.filter(x=>x.missionId===m.id)){
    const decision=iri('decision:'+mv.id);
    const used=[...(snapshots.has(mv.turnNumber)?[iri('snapshot:'+mv.turnNumber)]:[]),...(mv.evidenceRef?[`<${mv.evidenceRef}>`]:[])];
    n3+=`${iri('move:'+mv.id)} a prov:Activity; dcterms:isPartOf ${iri('turn:'+mv.turnNumber)}; ${association(mv.membershipId,mv.roleId)}; `
      +`prov:endedAtTime ${time(mv.madeAt)}; prov:generated ${decision}`
      +(used.length?`; prov:used ${used.join(', ')}`:'')+'.\n';
    n3+=`${decision} a prov:Entity; dcterms:type ${lit(mv.kind)}; rdfs:label ${lit(mv.action)}; prov:wasAttributedTo ${agent(mv.membershipId)}; `
      +`prov:generatedAtTime ${time(mv.madeAt)}`
      +(mv.reason!==undefined?`; dcterms:description ${lit(mv.reason)}`:'')+'.\n';
    if(mv.evidenceRef&&mv.evidenceSha256)n3+=`<${mv.evidenceRef}> <urn:fieldwork:sha256> ${lit(mv.evidenceSha256)}.\n`;
  }
  for(const end of ends.values()){
    const accepted=s.resolution.filter(o=>o.missionId===m.id&&o.turnNumber===end.turnNumber&&o.decisionMoveId).map(o=>iri('decision:'+o.decisionMoveId));
    const facilitator=state.membership.find(x=>x.id===end.endedByMembership);
    n3+=`${iri('turn:'+end.turnNumber+':end')} a prov:Activity; dcterms:isPartOf <${base}>; `
      +(facilitator&&memberships.has(facilitator.id)?association(facilitator.id,facilitator.roleId)+'; ':'')
      +`prov:startedAtTime ${time(end.endedAt)}; prov:endedAtTime ${time(end.endedAt)}`
      +(accepted.length?`; prov:used ${accepted.join(', ')}`:'')
      +(releases.some(r=>r.turnNumber===end.turnNumber+1)?`; prov:generated ${iri('snapshot:'+(end.turnNumber+1))}`:'')+'.\n';
  }
  return n3;
}
