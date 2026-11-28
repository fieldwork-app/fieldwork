import type {Workflow} from './types.js';

/** Positions for every node, laid out left to right in the order the work happens.
 *
 *  Written because exploding a micro-workflow drops its members in a row from the host's
 *  position, on top of whatever was to the right. That was left visible rather than guessed
 *  at ([92](../docs/experiments/92-micro-workflow-on-the-canvas.md)); this is the guess
 *  being made deliberately, as something a practitioner asks for rather than something that
 *  happens to their canvas without being asked.
 *
 *  A column is a depth: the longest path from any source. Longest rather than shortest, so
 *  a node never sits to the left of something feeding it — which is the one property a
 *  reader relies on when following a graph left to right.
 *
 *  Rows within a column keep their existing top-to-bottom order, so a tidy does not
 *  reshuffle a canvas somebody has already arranged. It is deliberately not a graph-drawing
 *  algorithm: no edge-crossing minimisation, no barycentre passes. It makes a canvas
 *  readable again after an explode, and says so. */

export const COLUMN_WIDTH=300;
export const ROW_HEIGHT=150;
export const ORIGIN={x:40,y:40};
/** Space between two nodes in a column. Rows are stacked by each node's MEASURED height plus this, because a node's
 *  height is its text: raised to a readable 14 px on 2026-11-07, nodes grew to 150–280px and a fixed 150px row laid
 *  them on top of each other. ROW_HEIGHT stays the step for a node whose height is not known (outside a browser). */
export const ROW_GAP=30;

/** Longest-path depth per node. Cycles cannot occur — `validateWorkflow` rejects them — but
 *  a guard is kept so a malformed graph laid out by hand cannot loop forever here. */
export function depths(workflow:Workflow):Map<string,number>{
  const incoming=new Map<string,string[]>();
  for(const node of workflow.nodes)incoming.set(node.id,[]);
  for(const edge of workflow.edges)incoming.get(edge.to)?.push(edge.from);
  const depth=new Map<string,number>();
  const visiting=new Set<string>();
  const of=(id:string):number=>{
    const known=depth.get(id);
    if(known!==undefined)return known;
    if(visiting.has(id))return 0;
    visiting.add(id);
    const sources=incoming.get(id)??[];
    const value=sources.length?Math.max(...sources.map(of))+1:0;
    visiting.delete(id);
    depth.set(id,value);
    return value;
  };
  for(const node of workflow.nodes)of(node.id);
  return depth;
}

export function tidyLayout(workflow:Workflow,heights?:ReadonlyMap<string,number>):Map<string,{x:number;y:number}>{
  const depth=depths(workflow);
  const columns=new Map<number,string[]>();
  for(const node of [...workflow.nodes].sort((a,b)=>a.y-b.y||a.x-b.x)){
    const column=depth.get(node.id)??0;
    (columns.get(column)??columns.set(column,[]).get(column)!).push(node.id);
  }
  const positions=new Map<string,{x:number;y:number}>();
  for(const [column,ids] of columns){
    let y=ORIGIN.y;
    for(const id of ids){
      positions.set(id,{x:ORIGIN.x+column*COLUMN_WIDTH,y});
      const h=heights?.get(id);
      // Rounded up to 10px, so a height re-measured at another zoom gives the same layout and a second Tidy is a no-op.
      y+=h?Math.ceil(h/10)*10+ROW_GAP:ROW_HEIGHT;
    }
  }
  return positions;
}

/** True when every node already sits where a tidy would put it, so the button can say
 *  nothing happened instead of appearing to do nothing. */
export const alreadyTidy=(workflow:Workflow,heights?:ReadonlyMap<string,number>):boolean=>{
  const positions=tidyLayout(workflow,heights);
  return workflow.nodes.every(node=>{
    const at=positions.get(node.id);
    // WITHIN A FEW PIXELS: heights are measured on screen, and a browser re-measuring at another zoom can differ by one
    // rounding step (WebKit, 2026-11-07). A canvas that close to its tidy layout is laid out.
    return !!at&&at.x===node.x&&Math.abs(at.y-node.y)<=12;
  });
};

/** A NODE'S BOX ON THE CANVAS, where it has not been drawn yet: the column's width less its gutter, and a row. */
export const DEFAULT_NODE_SIZE={width:COLUMN_WIDTH-40,height:ROW_HEIGHT};

/** WHERE A NEW NODE CAN GO WITHOUT COVERING ANOTHER (2026-11-28). Found 2026-11-27, writing the blank-port test: three
 *  widgets added from the library in a row landed on top of one another, because each was placed 80 px from the last by
 *  a count of the nodes, and a node is about 260 px wide and 150 to 280 px tall. This starts where the node would have
 *  gone, steps down its column, then across to the next, and takes the first place whose box, with a gap all round,
 *  touches no node's box. Sizes are measured where the canvas has drawn the node, and the default otherwise. */
export function freeSpot(nodes:readonly {id:string;x:number;y:number}[],want:{x:number;y:number},
    sizes:ReadonlyMap<string,{width:number;height:number}>=new Map(),size=DEFAULT_NODE_SIZE,
    /** The part of the canvas on screen: a free place inside it is taken first, so the new node is seen where it lands. */
    visible?:{x:number;y:number;width:number;height:number}|null):{x:number;y:number}{
  const boxes=nodes.map(n=>({x:n.x,y:n.y,...(sizes.get(n.id)??DEFAULT_NODE_SIZE)}));
  const gap=ROW_GAP;
  const clear=(x:number,y:number)=>boxes.every(b=>x+size.width+gap<=b.x||b.x+b.width+gap<=x||y+size.height+gap<=b.y||b.y+b.height+gap<=y);
  // ON SCREEN FIRST (2026-11-28): placed below everything, a node added to a full canvas landed out of sight, and the
  // practitioner would have added it without seeing it. Inside the view, from its top left, a gap in from the edges.
  if(visible){
    for(let x=visible.x+gap;x+size.width<=visible.x+visible.width-gap;x+=size.width+gap)
      for(let y=visible.y+gap;y+size.height<=visible.y+visible.height-gap;y+=Math.round((size.height+gap)/2))
        if(clear(x,y))return {x:Math.round(x),y:Math.round(y)};
  }
  // Down the column first, as far as twelve rows, then the next column over: a canvas is read left to right.
  for(let column=0;column<40;column++)
    for(let row=0;row<12;row++){
      const x=want.x+column*COLUMN_WIDTH,y=want.y+row*(size.height+gap);
      if(clear(x,y))return {x,y};
    }
  const right=Math.max(want.x,...boxes.map(b=>b.x+b.width+gap));
  return {x:right,y:want.y};
}
