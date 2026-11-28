import test from 'node:test';
import assert from 'node:assert/strict';
import {tidyLayout,depths,alreadyTidy,freeSpot,DEFAULT_NODE_SIZE,COLUMN_WIDTH,ROW_HEIGHT,ORIGIN} from '../build/layout.js';

const graph=(nodes,edges)=>({schema:'fieldwork/workflow/1',
  nodes:nodes.map(([id,x=0,y=0])=>({id,type:'point_input',x,y,params:{label:id}})),
  edges:edges.map(([from,to],i)=>({id:`e${i}`,from,to,port:'points'}))});

test('a node never sits left of something that feeds it',()=>{
  // Longest path, not shortest: d is fed by c, so it must be right of c even though a
  // reaches it directly as well.
  const d=depths(graph([['a'],['b'],['c'],['dd']],[['a','b'],['b','c'],['c','dd'],['a','dd']]));
  assert.equal(d.get('a'),0);assert.equal(d.get('b'),1);
  assert.equal(d.get('c'),2);assert.equal(d.get('dd'),3,'not 1, which the short path would give');
});

test('columns are the order of work and rows keep the arrangement already made',()=>{
  const w=graph([['a',0,500],['b',0,100],['out',0,0]],[['a','out'],['b','out']]);
  const at=tidyLayout(w);
  assert.equal(at.get('b').x,ORIGIN.x,'both sources share the first column');
  assert.equal(at.get('a').x,ORIGIN.x);
  assert.equal(at.get('out').x,ORIGIN.x+COLUMN_WIDTH);
  assert.equal(at.get('b').y,ORIGIN.y,'b was above a and stays above it');
  assert.equal(at.get('a').y,ORIGIN.y+ROW_HEIGHT);
});

test('a tidy canvas reports that it is already tidy',()=>{
  const w=graph([['a'],['b']],[['a','b']]);
  assert.equal(alreadyTidy(w),false);
  for(const node of w.nodes)Object.assign(node,tidyLayout(w).get(node.id));
  assert.equal(alreadyTidy(w),true);
});

test('every node is placed, including ones nothing connects',()=>{
  const w=graph([['a'],['lonely'],['b']],[['a','b']]);
  const at=tidyLayout(w);
  assert.equal(at.size,3);
  assert.equal(at.get('lonely').x,ORIGIN.x,'an unconnected node is a source');
});

test('a malformed cyclic graph is laid out rather than looping forever',()=>{
  // validateWorkflow rejects cycles, so this cannot arrive from the application; the guard
  // exists so that a hand-edited file cannot hang the canvas.
  const w=graph([['a'],['b']],[['a','b'],['b','a']]);
  const at=tidyLayout(w);
  assert.equal(at.size,2);
});

test('rows stack by measured height, so tall nodes do not overlap; unknown heights keep the fixed step',async()=>{
  const {tidyLayout,ROW_GAP}=await import('../build/layout.js');
  const w={nodes:[{id:'a',x:0,y:0},{id:'b',x:0,y:10},{id:'c',x:0,y:20}],edges:[]};
  const at=tidyLayout(w,new Map([['a',260],['b',120]]));
  assert.equal(at.get("b").y-at.get("a").y,260+ROW_GAP);
  assert.equal(at.get('c').y-at.get('b').y,120+ROW_GAP);
  const fixed=tidyLayout(w);
  assert.equal(fixed.get('b').y-fixed.get('a').y,ROW_HEIGHT);
});

/** A NEW NODE CLEAR OF THE OTHERS (2026-11-28): three added from the library in a row had landed on one another. */
const overlap=(a,b,s=DEFAULT_NODE_SIZE)=>a.x<b.x+s.width&&b.x<a.x+s.width&&a.y<b.y+s.height&&b.y<a.y+s.height;
test('three nodes added in a row land clear of one another',()=>{
  const nodes=[];
  for(let i=0;i<3;i++){const at=freeSpot(nodes,{x:180,y:90});nodes.push({id:`n${i}`,...at});}
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert.ok(!overlap(nodes[i],nodes[j]),`${i} and ${j} overlap`);
  assert.deepEqual({x:nodes[0].x,y:nodes[0].y},{x:180,y:90},'the first takes the place asked for');
});
test('a measured tall node is cleared by its height, not the default',()=>{
  const at=freeSpot([{id:'tall',x:180,y:90}],{x:180,y:90},new Map([['tall',{width:260,height:400}]]));
  assert.ok(at.y>=90+400||at.x>=180+260,JSON.stringify(at));
});
test('a free place is taken where it is asked for',()=>{
  assert.deepEqual(freeSpot([{id:'far',x:2000,y:2000}],{x:180,y:90}),{x:180,y:90});
});

test('a free place on screen is taken before one out of sight',()=>{
  const view={x:1000,y:500,width:900,height:600};
  const at=freeSpot([{id:'a',x:1030,y:530}],{x:180,y:90},new Map(),undefined,view);
  assert.ok(at.x>=view.x&&at.y>=view.y&&at.x+260<=view.x+view.width&&at.y+150<=view.y+view.height,JSON.stringify(at));
  assert.ok(!(at.x<1030+260&&1030<at.x+260&&at.y<530+150&&530<at.y+150),'and clear of the node there');
});
