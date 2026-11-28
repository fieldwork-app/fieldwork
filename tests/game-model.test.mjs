import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Parser} from 'n3';
import {TABLES,APPEND_ONLY,READ_RULES,emptyState,readable,startMission,submitMove,endTurn,missionProvenanceN3,GameRefusal}
  from '../build/game-model.js';

/** THE COOPERATIVE TRAINING MISSION'S DATA MODEL (experiment 233, second spike, 2026-11-28). Each role's read rules,
 *  the moves, and the turn-ending function, in the TypeScript model; and a read of the SQL draft to check it states the
 *  same tables, policies, append-only triggers and functions. The SQL itself is not run. */

const SQL=readFileSync(new URL('../docs/experiments/233/game-model.sql',import.meta.url),'utf8');
const H=c=>c.repeat(64);
const T=(minute,second=0)=>`2026-11-28T10:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}.000Z`;

/** Mission M: teams A and B; roles facilitator, field officer, laboratory lead. Memberships: the facilitator; A's field
 *  officer and laboratory lead; B's field officer. Mission N has its own facilitator. An outsider holds no membership. */
function world(){
  const s=emptyState();
  const mission=(id,by)=>({id,title:'Country X, three turns',status:'setup',turnCount:3,currentTurn:0,
    templateRepository:'https://github.com/digital-twin-ph/example-training-mission',templateCommit:'a'.repeat(40),
    kernelSha256:H('b'),createdBy:by,createdAt:T(0)});
  s.mission.push(mission('M','u-fac'),mission('N','u-fac-n'));
  s.mission_secret.push({missionId:'M',seed:1729,modelParameters:{r0:1.8},answerKey:{hotspot:'Kalinga ward'}});
  s.team.push({id:'A',missionId:'M',name:'Team A'},{id:'B',missionId:'M',name:'Team B'},{id:'NA',missionId:'N',name:'Team N'});
  s.role.push({id:'r-fac',missionId:'M',key:'facilitator',label:'Facilitator',kind:'facilitator'},
    {id:'r-field',missionId:'M',key:'field-officer',label:'Field officer',kind:'player'},
    {id:'r-lab',missionId:'M',key:'laboratory-lead',label:'Laboratory lead',kind:'player'},
    {id:'r-fac-n',missionId:'N',key:'facilitator',label:'Facilitator',kind:'facilitator'});
  const membership=(id,missionId,teamId,roleId,roleKind,userId,githubLogin)=>({id,missionId,teamId,roleId,roleKind,userId,
    ...(githubLogin?{githubLogin}:{}),identityBasis:githubLogin?'attested':'declared',joinedAt:T(1)});
  s.membership.push(membership('s-fac','M',null,'r-fac','facilitator','u-fac','facilitator-login'),
    membership('s-a-field','M','A','r-field','player','u-a-field','a-field-login'),
    membership('s-a-lab','M','A','r-lab','player','u-a-lab'),
    membership('s-b-field','M','B','r-field','player','u-b-field'),
    membership('s-fac-n','N',null,'r-fac-n','facilitator','u-fac-n'));
  const ev=(id,forTurn,teamId,roleId,label)=>({id,missionId:'M',forTurn,teamId,roleId,label,path:`hidden/${id}.csv`,sha256:H(id.at(-1))});
  s.evidence.push(ev('e1',1,null,null,'Line list, week 1'),ev('e2',1,null,'r-lab','Laboratory results, week 1'),
    ev('e3',1,'B',null,'District reports for team B'),ev('e4',2,null,null,'Line list, week 2'));
  return s;
}
const USERS={facilitator:'u-fac',aField:'u-a-field',aLab:'u-a-lab',bField:'u-b-field',otherFacilitator:'u-fac-n',outsider:'u-x'};
const ids=(s,user,table)=>readable(s,user)[table].map(r=>r.id??r.evidenceId??r.missionId+':'+(r.number??r.turnNumber)+(r.teamId?':'+r.teamId:''));
const decision=(turn,action='Check the denominator for district 4')=>({missionId:'M',turn,kind:'decision',action,
  reason:'The rise follows a change in the reporting population',evidenceRef:'urn:fieldwork:run:r1:step:rate',
  evidenceSha256:H('c'),reconsiderIf:'The rate stays high once the denominator is corrected'});
function started(){const s=world();startMission(s,USERS.facilitator,'M',T(2));return s;}
const refused=(fn,code)=>assert.throws(fn,e=>e instanceof GameRefusal&&e.code===code);

// ── Each role's read rules ───────────────────────────────────────────────────────────────────────────────────────

test('the facilitator reads every row of their own mission, the secret and unreleased evidence included', ()=>{
  const s=started();submitMove(s,USERS.aField,decision(1),T(3),'mA');submitMove(s,USERS.bField,decision(1),T(3),'mB');
  const mine=readable(s,USERS.facilitator);
  for(const table of TABLES){
    const all=s[table].filter(r=>(r.missionId??r.id)==='M');
    assert.equal(mine[table].length,all.length,table);
  }
  assert.deepEqual(ids(s,USERS.facilitator,'evidence'),['e1','e2','e3','e4']);
  assert.equal(mine.mission_secret[0].seed,1729);
});

test('a facilitator of another mission, and someone with no membership, read nothing of mission M', ()=>{
  const s=started();submitMove(s,USERS.aField,decision(1),T(3),'mA');
  for(const user of [USERS.otherFacilitator,USERS.outsider]){
    const seen=readable(s,user);
    for(const table of TABLES)assert.equal(seen[table].filter(r=>(r.missionId??r.id)==='M').length,0,`${user} ${table}`);
  }
});

test('a player reads the mission, its roles and its turns', ()=>{
  const s=started();
  for(const user of [USERS.aField,USERS.aLab,USERS.bField]){
    const seen=readable(s,user);
    assert.deepEqual(seen.mission.map(m=>m.id),['M']);
    assert.deepEqual(seen.role.map(r=>r.key),['facilitator','field-officer','laboratory-lead']);
    assert.deepEqual(seen.turn.map(t=>t.number),[1]);
  }
});

test('a player reads their own team, and not the other team, its memberships, moves or resolutions', ()=>{
  const s=started();
  submitMove(s,USERS.aField,decision(1),T(3),'mA');submitMove(s,USERS.bField,decision(1),T(3),'mB');
  endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'q1'},T(5));
  assert.deepEqual(ids(s,USERS.aField,'team'),['A']);
  assert.deepEqual(ids(s,USERS.bField,'team'),['B']);
  assert.deepEqual(readable(s,USERS.aField).membership.map(x=>x.id),['s-a-field','s-a-lab']);
  assert.deepEqual(readable(s,USERS.bField).membership.map(x=>x.id),['s-b-field']);
  assert.deepEqual(ids(s,USERS.aLab,'move'),['mA']);
  assert.deepEqual(ids(s,USERS.bField,'move'),['mB']);
  assert.deepEqual(readable(s,USERS.aField).resolution.map(o=>o.teamId),['A']);
  assert.deepEqual(readable(s,USERS.bField).resolution.map(o=>o.teamId),['B']);
});

test('a player never reads the facilitator\'s membership', ()=>{
  const s=started();
  for(const user of [USERS.aField,USERS.aLab,USERS.bField])
    assert.ok(!readable(s,user).membership.some(x=>x.roleKind==='facilitator'),user);
});

test('evidence by role and team: each player reads what is released for their team and their role, and nothing else', ()=>{
  const s=started();
  assert.deepEqual(ids(s,USERS.aField,'evidence'),['e1']);          // not e2 (laboratory), e3 (team B) or e4 (turn 2)
  assert.deepEqual(ids(s,USERS.aLab,'evidence'),['e1','e2']);       // not e3 or e4
  assert.deepEqual(ids(s,USERS.bField,'evidence'),['e1','e3']);     // not e2 or e4
  assert.deepEqual(ids(s,USERS.aLab,'release'),['e1','e2']);        // the release rows follow the same rule
});

test('nothing unreleased reaches a player: turn 2\'s evidence only once turn 1 has ended', ()=>{
  const s=started();
  for(const user of [USERS.aField,USERS.aLab,USERS.bField])assert.ok(!ids(s,user,'evidence').includes('e4'),user);
  endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'q1'},T(5));
  for(const user of [USERS.aField,USERS.aLab,USERS.bField])assert.ok(ids(s,user,'evidence').includes('e4'),user);
});

test('before the mission starts, players read no evidence at all', ()=>{
  const s=world();
  for(const user of [USERS.aField,USERS.aLab,USERS.bField])assert.deepEqual(ids(s,user,'evidence'),[],user);
});

test('the secret (seed, parameters, answer key) is the facilitator\'s in play, and players\' at the debrief', ()=>{
  const s=started();
  for(const user of [USERS.aField,USERS.aLab,USERS.bField,USERS.outsider])assert.equal(readable(s,user).mission_secret.length,0,user);
  for(const [turn,q] of [[1,'q1'],[2,'q2'],[3,'q3']])endTurn(s,USERS.facilitator,{missionId:'M',turn,requestId:q},T(10+turn));
  for(const user of [USERS.aField,USERS.aLab,USERS.bField])assert.equal(readable(s,user).mission_secret.length,1,user);
  assert.equal(readable(s,USERS.outsider).mission_secret.length,0);
  assert.equal(readable(s,USERS.otherFacilitator).mission_secret.length,0);
});

// ── Moves ────────────────────────────────────────────────────────────────────────────────────────────────────────

test('a move is timestamped by the server and attributed from the membership, whatever the caller sends', ()=>{
  const s=started();
  const move=submitMove(s,USERS.aLab,{...decision(1),teamId:'B',roleId:'r-field',membershipId:'s-b-field',userId:'u-b-field',madeAt:T(0)},T(4),'m1');
  assert.deepEqual([move.teamId,move.roleId,move.membershipId,move.userId,move.madeAt,move.late],['A','r-lab','s-a-lab','u-a-lab',T(4),false]);
});

test('only a membershiped player makes a move: not the facilitator, not an outsider, not before the start', ()=>{
  const s=started();
  refused(()=>submitMove(s,USERS.facilitator,decision(1),T(3)),'42501');
  refused(()=>submitMove(s,USERS.outsider,decision(1),T(3)),'42501');
  refused(()=>submitMove(s,USERS.otherFacilitator,decision(1),T(3)),'42501');
  refused(()=>submitMove(world(),USERS.aField,decision(1),T(3)),'55000');
  refused(()=>submitMove(s,USERS.aField,decision(2),T(3)),'55000');   // turn 2 has not opened
  assert.equal(s.move.length,0);
});

test('a decision carries its reason, its evidence with a digest, and what would change it; a proposal need not', ()=>{
  const s=started();
  for(const missing of ['reason','evidenceRef','evidenceSha256','reconsiderIf']){
    const d=decision(1);delete d[missing];refused(()=>submitMove(s,USERS.aField,d,T(3)),'23514');
  }
  refused(()=>submitMove(s,USERS.aField,{...decision(1),reason:'  '},T(3)),'23514');
  refused(()=>submitMove(s,USERS.aField,{...decision(1),evidenceSha256:'abc'},T(3)),'23514');
  refused(()=>submitMove(s,USERS.aField,{...decision(1),evidenceRef:'run 42 on my laptop'},T(3)),'23514');
  assert.equal(submitMove(s,USERS.aField,{missionId:'M',turn:1,kind:'proposal',action:'Map the week-1 cases'},T(3)).kind,'proposal');
});

test('moves are append-only: a stored move cannot be changed', ()=>{
  const s=started();const move=submitMove(s,USERS.aField,decision(1),T(3));
  assert.throws(()=>{move.action='Something else';},TypeError);
  assert.throws(()=>{move.madeAt=T(0);},TypeError);
  assert.equal(s.move[0].action,'Check the denominator for district 4');
});

// ── The turn-ending function ─────────────────────────────────────────────────────────────────────────────────────

test('only the mission\'s facilitator ends a turn', ()=>{
  const s=started();
  for(const user of [USERS.aField,USERS.aLab,USERS.bField,USERS.otherFacilitator,USERS.outsider])
    refused(()=>endTurn(s,user,{missionId:'M',turn:1,requestId:'q-'+user},T(5)),'42501');
  assert.equal(s.mission[0].currentTurn,1);assert.equal(s.turn_end.length,0);
});

test('ending a turn records it, takes each team\'s last decision, opens the next turn and releases its evidence', ()=>{
  const s=started();
  submitMove(s,USERS.aField,decision(1,'first'),T(3),'a1');
  submitMove(s,USERS.aLab,decision(1,'second'),T(4),'a2');
  submitMove(s,USERS.aField,{missionId:'M',turn:1,kind:'proposal',action:'a proposal after it'},T(4,30),'a3');
  const ended=endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'q1'},T(5));
  assert.deepEqual(ended,{endedTurn:1,openedTurn:2,replayed:false});
  assert.deepEqual(s.turn_end.map(e=>[e.turnNumber,e.endedAt,e.endedByMembership]),[[1,T(5),'s-fac']]);
  assert.deepEqual(s.resolution.map(o=>[o.teamId,o.decisionMoveId]),[['A','a2'],['B',null]]);
  assert.deepEqual(s.turn.map(t=>t.number),[1,2]);
  assert.deepEqual(s.release.filter(r=>r.turnNumber===2).map(r=>r.evidenceId),['e4']);
  assert.equal(s.mission[0].currentTurn,2);
});

test('the same End turn request sent twice advances the turn once and answers the same', ()=>{
  const s=started();
  const first=endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'q1'},T(5));
  const again=endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'q1'},T(6));
  assert.deepEqual(again,{...first,replayed:true});
  assert.equal(s.turn_end.length,1);assert.equal(s.turn.length,2);assert.equal(s.resolution.length,2);
  assert.equal(s.release.filter(r=>r.evidenceId==='e4').length,1);
  assert.equal(s.mission[0].currentTurn,2);
});

test('two different End turn requests for the same turn: the second is refused as stale', ()=>{
  const s=started();
  endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'tab-1'},T(5));
  refused(()=>endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'tab-2'},T(5)),'40001');
  assert.equal(s.mission[0].currentTurn,2);assert.equal(s.turn_end.length,1);
});

test('a move made after its turn ended is kept, marked late, and never counted', ()=>{
  const s=started();
  submitMove(s,USERS.aField,decision(1,'in time'),T(3),'early');
  endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'q1'},T(5));
  const late=submitMove(s,USERS.aField,decision(1,'too late'),T(6),'late');
  assert.equal(late.late,true);
  assert.equal(s.resolution.find(o=>o.teamId==='A').decisionMoveId,'early');
  // and it does not count when the next turn ends either: it was aimed at turn 1
  endTurn(s,USERS.facilitator,{missionId:'M',turn:2,requestId:'q2'},T(8));
  assert.equal(s.resolution.find(o=>o.turnNumber===2&&o.teamId==='A').decisionMoveId,null);
  // a move for the open turn is not late
  assert.equal(submitMove(s,USERS.aField,decision(3),T(9)).late,false);
});

test('a team whose only decision is late has no accepted decision for that turn', ()=>{
  const s=started();
  endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'q1'},T(5));
  submitMove(s,USERS.bField,decision(1),T(6),'b-late');
  assert.equal(s.resolution.find(o=>o.teamId==='B').decisionMoveId,null);
});

test('the last turn\'s end opens the debrief, opens no turn, and refuses another end', ()=>{
  const s=started();
  for(const [turn,q] of [[1,'q1'],[2,'q2']])endTurn(s,USERS.facilitator,{missionId:'M',turn,requestId:q},T(10+turn));
  assert.deepEqual(endTurn(s,USERS.facilitator,{missionId:'M',turn:3,requestId:'q3'},T(13)),{endedTurn:3,openedTurn:null,replayed:false});
  assert.equal(s.mission[0].status,'debrief');assert.equal(s.turn.length,3);
  refused(()=>endTurn(s,USERS.facilitator,{missionId:'M',turn:3,requestId:'q4'},T(14)),'55000');
  assert.deepEqual(endTurn(s,USERS.facilitator,{missionId:'M',turn:3,requestId:'q3'},T(14)),{endedTurn:3,openedTurn:null,replayed:true});
});

test('starting a mission: the facilitator only, once, releasing turn 1\'s evidence', ()=>{
  const s=world();
  refused(()=>startMission(s,USERS.aField,'M',T(2)),'42501');
  assert.deepEqual(startMission(s,USERS.facilitator,'M',T(2)),{openedTurn:1,replayed:false});
  assert.deepEqual(startMission(s,USERS.facilitator,'M',T(3)),{openedTurn:1,replayed:true});
  assert.deepEqual(s.release.map(r=>r.evidenceId),['e1','e2','e3']);assert.equal(s.turn.length,1);
});

// ── Provenance ───────────────────────────────────────────────────────────────────────────────────────────────────

const PROV='http://www.w3.org/ns/prov#';
const quads=n3=>new Parser({format:'text/turtle'}).parse(n3);
const has=(qs,s,p,o)=>qs.some(q=>(!s||q.subject.value===s)&&q.predicate.value===p&&(!o||q.object.value===o));
const M='urn:fieldwork:mission:M';
function played(){
  const s=started();
  submitMove(s,USERS.aField,decision(1),T(3),'mA');submitMove(s,USERS.bField,decision(1),T(3),'mB');
  endTurn(s,USERS.facilitator,{missionId:'M',turn:1,requestId:'q1'},T(5));
  submitMove(s,USERS.aField,decision(1,'too late'),T(6),'mLate');
  return s;
}

test('provenance: each move is an activity by a person in a role, at a time, using the snapshot and its evidence', ()=>{
  const qs=quads(missionProvenanceN3(played(),USERS.facilitator,'M'));
  const move=`${M}:move:mA`,decision=`${M}:decision:mA`,agent='https://github.com/a-field-login';
  assert.ok(has(qs,move,'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',PROV+'Activity'));
  assert.ok(has(qs,move,PROV+'wasAssociatedWith',agent));
  assert.ok(has(qs,null,PROV+'hadRole',`${M}:role:field-officer`));
  assert.ok(has(qs,move,PROV+'endedAtTime',T(3)));
  assert.ok(has(qs,move,PROV+'used',`${M}:snapshot:1`));
  assert.ok(has(qs,move,PROV+'used','urn:fieldwork:run:r1:step:rate'));
  assert.ok(has(qs,'urn:fieldwork:run:r1:step:rate','urn:fieldwork:sha256',H('c')));
  assert.ok(has(qs,decision,PROV+'wasAttributedTo',agent));
  assert.ok(has(qs,decision,PROV+'generatedAtTime',T(3)));
  assert.ok(has(qs,agent,'urn:fieldwork:githubLogin','a-field-login'));
  assert.ok(has(qs,agent,'urn:fieldwork:identityBasis','attested'));
});

test('provenance: a turn\'s end uses the accepted decisions, not the late one, and generates the next snapshot', ()=>{
  const qs=quads(missionProvenanceN3(played(),USERS.facilitator,'M'));
  const end=`${M}:turn:1:end`;
  assert.ok(has(qs,end,PROV+'used',`${M}:decision:mA`));
  assert.ok(has(qs,end,PROV+'used',`${M}:decision:mB`));
  assert.ok(!has(qs,end,PROV+'used',`${M}:decision:mLate`));
  assert.ok(has(qs,end,PROV+'generated',`${M}:snapshot:2`));
  assert.ok(has(qs,`${M}:snapshot:2`,PROV+'hadMember',`${M}:evidence:e4`));
  assert.ok(has(qs,`${M}:turn:1`,PROV+'endedAtTime',T(5)));
  assert.ok(has(qs,M,PROV+'used','https://github.com/digital-twin-ph/example-training-mission/tree/'+'a'.repeat(40)));
  assert.ok(has(qs,`urn:fieldwork:kernel:sha256:${H('b')}`,'urn:fieldwork:sha256',H('b')));
});

test('provenance as a player reads it: no other team, no evidence they cannot read, no secret, no account ids, no paths', ()=>{
  const s=played();
  const n3=missionProvenanceN3(s,USERS.aField,'M');quads(n3);
  assert.ok(n3.includes(':move:mA>'));
  for(const absent of [':move:mB>',':decision:mB>',':evidence:e2>',':evidence:e3>','1729','Kalinga ward','u-a-field','u-fac','hidden/'])
    assert.ok(!n3.includes(absent),absent);
  assert.equal(missionProvenanceN3(s,USERS.outsider,'M'),'');
});

// ── The SQL draft says the same ──────────────────────────────────────────────────────────────────────────────────

test('the SQL creates exactly the model\'s tables, each with row-level security and one read policy', ()=>{
  const created=[...SQL.matchAll(/^create table game\.(\w+)/gm)].map(m=>m[1]).sort();
  assert.deepEqual(created,[...TABLES].sort());
  assert.deepEqual(Object.keys(READ_RULES).sort(),[...TABLES].sort());
  for(const table of TABLES){
    assert.match(SQL,new RegExp(`alter table game\\.${table}\\s+enable row level security`),table);
    assert.equal([...SQL.matchAll(new RegExp(`create policy \\w+\\s+on game\\.${table}\\s+for select`,'g'))].length,1,table);
  }
  assert.doesNotMatch(SQL,/for (update|delete|all) to/);
  assert.doesNotMatch(SQL,/grant [^;]*\b(update|delete|truncate)\b/i);
  assert.doesNotMatch(SQL,/\bto anon\b/);
});

test('the SQL refuses update, delete and truncate on every append-only table, and nothing grants insert on them', ()=>{
  for(const table of APPEND_ONLY){
    assert.match(SQL,new RegExp(`before update or delete on game\\.${table}\\s+for each row execute function game\\.refuse_change`),table);
    assert.match(SQL,new RegExp(`before truncate on game\\.${table}\\s+for each statement`),table);
  }
  const grantedInsert=SQL.match(/grant insert on ([^;]+) to authenticated/)[1];
  for(const table of [...APPEND_ONLY,'mission'])assert.ok(!grantedInsert.includes(`game.${table},`)&&!grantedInsert.endsWith(`game.${table}`),table);
});

test('the SQL\'s writing functions run as definer with a fixed search path, and time a move after taking the lock', ()=>{
  for(const fn of ['create_mission','start_mission','submit_move','end_turn'])
    assert.match(SQL,new RegExp(`create function game\\.${fn}\\([\\s\\S]*?security definer set search_path = ''`),fn);
  const submit=SQL.slice(SQL.indexOf('create function game.submit_move'),SQL.indexOf('create function game.end_turn'));
  assert.ok(submit.indexOf('for share')<submit.indexOf('clock_timestamp()'));
  const end=SQL.slice(SQL.indexOf('create function game.end_turn'));
  assert.ok(end.indexOf('for update')<end.indexOf('request_id = p_request'));
  assert.match(SQL,/unique \(mission_id, request_id\)/);
});
