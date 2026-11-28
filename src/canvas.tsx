import type {Node,NodeProps,Edge,Connection} from '@xyflow/react';
import type {Workflow,WorkflowNode,NodeDefinition,NodeType} from './types.js';
import {PORT_ROLES,portBase,shownPort} from './port-names.js';
import {symbolOf,symbolShapes,sourceSymbol,SYMBOL_WORDS,type PortSymbol} from './port-symbols.js';
export interface NodeDescription extends Record<string,unknown> {definition:NodeDefinition;
  /** The node found something at the run. Separate from `alert`, which is the text on the badge:
   *  closing the badge takes the text away and must not take away the signal that there is
   *  something to look at. */
  flagged?:boolean;
  /** What arrives at each connected port: the port, the kind the source sends, and the source's name. */
  inputsIn?:InputIn[];
  /** Whether the step can take another input, so the blank port is drawn; and what it takes, in words. */
  canAdd?:boolean;takes?:string;type:NodeType;label:string;subtitle:string;detail:string;status?:string;glow?:boolean;alert?:string}
export interface InputIn {port:string;kind:string;from:string}
type OperationFlowNode=Node<NodeDescription,'operation'>;
export interface CanvasAPI {update:(graph:Workflow,selection:string|null|undefined,statuses?:Record<string,string>)=>void;fit:()=>void;zoomIn:()=>void;zoomOut:()=>void;setBusy:(busy:boolean)=>void;
  /** The part of the canvas on screen, in canvas units, or null before it is laid out. */
  visibleArea:()=>{x:number;y:number;width:number;height:number}|null;
  /** Scrolls the canvas, at its zoom, to bring a node into the middle of the view. */
  reveal:(id:string)=>void}
export interface CanvasCallbacks {selectEdge:(id:string)=>void;ready:(api:CanvasAPI)=>void;describe:(node:WorkflowNode,status?:string)=>NodeDescription;select:(id:string)=>void;clear:()=>void;move:(id:string,position:{x:number;y:number})=>void;connect:(connection:Connection)=>void;valid:(connection:Connection|Edge)=>boolean;remove:(ids:string[])=>void;removeEdges:(ids:string[])=>void;zoom:(zoom:number)=>void}
import {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {ReactFlow, ReactFlowProvider, Background, Handle, Position, useNodesState, useEdgesState, useReactFlow, useUpdateNodeInternals, useNodesInitialized} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../flow.css';
/** A KIND'S SYMBOL (port-symbols.ts), drawn in the text colour; the name beside it carries the meaning. */
const Symbol=({symbol}:{symbol:PortSymbol})=><svg className="port-symbol" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" dangerouslySetInnerHTML={{__html:symbolShapes(symbol)}}/>;
function OperationNode({id,data,selected}:NodeProps<OperationFlowNode>) {
  const t=data.definition;
  const role=t.group==='Sources'?'input':t.group==='Outputs'?'output':'processing';
  // ONE MODEL FOR EVERY WIDGET (0.204.0; settled 2026-10-15 for the Map, experiment 116 for the rest, restated by the
  // practitioner 2026-11-27): the connected inputs, each a row with its kind's symbol and the source's name, and one blank
  // port while the step can take more. A drop on the blank port is bound by what arrives, and asks only when more than
  // one input fits. The declared ports stay underneath: saved workflows, receipts and port contracts are written in them.
  const inputsIn=(data.inputsIn as InputIn[]|undefined)??[];
  const type=data.type as NodeType;
  const roleOf=(port:string)=>PORT_ROLES[type]?.[port]??PORT_ROLES[type]?.[portBase(port)];
  const addLabel=type==='map_output'?'+ Add a layer':'+ Add an input';
  const outputSymbol=t.output?symbolOf(t.output):undefined;
  // THE OUTPUT NAMED BY WHAT IT CARRIES: Sample a raster gives points at points and areas over areas.
  const outputLabel=outputSymbol?SYMBOL_WORDS[outputSymbol]:'';
  const updateInternals=useUpdateNodeInternals();
  // Handle positions are cached by React Flow, so whatever changes which handles are drawn invalidates them, or a freshly
  // drawn port is a drop target the library does not know the position of.
  useEffect(()=>{updateInternals(id);},[id,JSON.stringify(inputsIn),data.canAdd,updateInternals]);
  // REACT FLOW'S CORNER LINK IS HIDDEN (`hideAttribution` on the canvas below): one Tab from a node reached it with a faint focus ring,
  // and Enter left Fieldwork for reactflow.dev (the practitioner, 2026-11-16). It is credited in Help instead; MIT asks
  // for no attribution on screen.
  // A PORT IS A POINTER'S DROP TARGET, hidden from assistive technology (aria-hidden on each Handle): connecting by
  // keyboard or screen reader is the Inspector's list for each input (the Section 508 audit, 2026-11-16).
  return <div data-node-role={role} className={`node ${t.color} ${selected?'selected':''} ${data.status==='running'?'running':''} ${data.status==='failed'?'failed':''} ${data.glow?'just-finished':''} ${data.flagged??data.alert?'alerting':''}`}>
    <div className="node-heading">{sourceSymbol(type)?<span className="node-icon"><Symbol symbol={sourceSymbol(type)!}/></span>:<span className="node-icon">{t.icon}</span>}<div><strong>{data.label}</strong><span className="node-id">{t.group}</span></div></div>
    {/* THE WIDGET'S OWN DESCRIPTION, THE SAME ON EVERY NODE OF ITS KIND, ON THE SELECTED NODE ONLY (the practitioner,
        2026-11-27): Point data's ran four lines on every Point data node, and the port rows of 0.204.0 made nodes tall
        enough to overlap in nine of eleven examples. A subtitle that says something about this node stays. */}
    {(selected||data.subtitle!==t.description)&&<div className="node-subtitle">{data.subtitle}</div>}
    {t.inputs.length>0&&<div className="node-ports">
      {inputsIn.map(({port,kind,from})=>{const symbol=symbolOf(kind),role=roleOf(port);
        return <div className="node-port-row" key={port} title={`${role?`${role}: `:''}${SYMBOL_WORDS[symbol]} from ${from}`}>
          <Handle aria-hidden="true" type="target" position={Position.Left} id={shownPort(type,port)} style={{top:'50%'}}/>
          <Symbol symbol={symbol}/>
          <span className="port-name">{role&&<span className="port-role">{role} </span>}{from}</span>
        </div>;})}
      {!!data.canAdd&&<div className="node-port-row node-add-layer" key="layer" title={`${addLabel.slice(2)}: ${String(data.takes??'')}`}>
        <Handle aria-hidden="true" type="target" position={Position.Left} id="layer" style={{top:'50%'}}/>
        <span>{addLabel}</span>
      </div>}
    </div>}
    {/* ONE OUTPUT CONNECTOR PER NODE, on its right edge, with no row of its own (the practitioner, 2026-11-27: "make
        them one connector per node … I am also able to hover each one and see what shape is coming out. I do that a
        lot."). Hovering shows the kind's symbol and its name. */}
    {t.output&&outputSymbol&&<Handle aria-hidden="true" type="source" position={Position.Right} id="out" className="node-output">
      <span className="node-output-tip"><Symbol symbol={outputSymbol}/>{outputLabel}</span>
    </Handle>}
    {data.alert&&<div className="node-alert" role="alert">
      <span title={data.alert}>⚠ {data.alert}</span>
      {/* Dismissible, because a badge that cannot be closed covers the node it is about and the
          practitioner has already read it. It comes back on the next run: dismissing a FINDING
          permanently would make the canvas quieter and less true, and the detail stays in the
          Inspector either way. */}
      <button type="button" className="node-alert-close" data-dismiss-alert={id}
        aria-label={`Dismiss the alert on ${data.label}`} title="Dismiss until the next run"
        onPointerDown={event=>{event.stopPropagation();}}
        onClick={event=>{event.stopPropagation();}}>×</button>
    </div>}
    <div className="node-bottom"><span>{data.detail}</span><span className="count">{data.status==='done'?'✓ Done':data.status==='running'?'Running…':data.type==='policy'?'N3 · WASM':'●'}</span></div>
  </div>;
}
const nodeTypes={operation:OperationNode};
export function mountCanvas(container:HTMLElement,callbacks:CanvasCallbacks):CanvasAPI{
  const notReady=()=>{throw new Error('Canvas is not mounted yet');};
  const api:CanvasAPI={update:notReady,fit:notReady,zoomIn:notReady,zoomOut:notReady,setBusy:notReady,visibleArea:()=>null,reveal:()=>{}};
  function Flow(){
    const [nodes,setNodes,onNodesChange]=useNodesState<OperationFlowNode>([]),[edges,setEdges,onEdgesChange]=useEdgesState<Edge>([]),[busy,setBusy]=useState(false);
    const flow=useReactFlow<OperationFlowNode,Edge>();
    const initialized=useNodesInitialized(),[fitRequested,setFitRequested]=useState(false);
    useEffect(()=>{
      if(!fitRequested||!initialized||!nodes.length||nodes.some(n=>!n.measured?.width||!n.measured?.height))return;
      // Imported nodes enter React state before React Flow measures them.
      // Fit the committed, measured graph rather than the previous empty canvas.
      const frame=requestAnimationFrame(()=>{void flow.fitView({padding:.16,duration:220});setFitRequested(false);});
      return ()=>cancelAnimationFrame(frame);
    },[fitRequested,initialized,nodes,flow]);
    useEffect(()=>{
      api.update=(graph,selection,statuses={})=>{
        // Keep React Flow's measured dimensions across status and selection updates.
        // Dropping them during a run can leave an unchanged node hidden until it resizes.
        setNodes(previous=>{const current=new Map(previous.map(n=>[n.id,n]));return graph.nodes.map(n=>({...current.get(n.id),id:n.id,type:'operation',position:{x:n.x,y:n.y},selected:n.id===selection,data:callbacks.describe(n,statuses[n.id])}));});
        // A CONNECTION IS SELECTED BY A CLICK, NOT REMOVED (2026-11-20): a click removed it at once, and on a dense canvas a
        // drag meant to pan took two of DR Congo's connections. Selected, it is drawn darker and thicker; Delete or the
        // Inspector's Remove connection removes it. Its band is 8 px, the line's own width, not 20.
        const chosenEdge=selection?.startsWith('edge:')?selection.slice(5):undefined;
        setEdges(graph.edges.map(e=>({id:e.id,source:e.from,sourceHandle:'out',target:e.to,targetHandle:shownPort((graph.nodes.find(n=>n.id===e.to)?.type??'') as NodeType,e.port),type:'default',
          selected:e.id===chosenEdge,style:e.id===chosenEdge?{stroke:'#0f4a3d',strokeWidth:4}:{stroke:'#9fb5a5',strokeWidth:1.7},interactionWidth:8})));
      };
      api.fit=()=>setFitRequested(true);api.zoomIn=()=>flow.zoomIn();api.zoomOut=()=>flow.zoomOut();api.setBusy=setBusy;
      // A NEW NODE IS PLACED WHERE IT CAN BE SEEN (2026-11-28): the visible area, so a free place is looked for there first,
      // and a reveal for when there was none.
      api.visibleArea=()=>{const r=container.getBoundingClientRect();if(!r.width||!r.height)return null;
        const a=flow.screenToFlowPosition({x:r.left,y:r.top}),b=flow.screenToFlowPosition({x:r.right,y:r.bottom});
        return {x:a.x,y:a.y,width:b.x-a.x,height:b.y-a.y};};
      // THE WHOLE NODE, not its corner (review of #8): a node placed beside a source near the edge began inside the view and
      // ran 300 px out of it, and a check of its top left did not scroll. Measured once drawn; scrolled, at the zoom as it
      // is, only where some of it is out of view.
      api.reveal=id=>{let tries=0;const go=()=>{const n=flow.getNode(id);
        if(!n?.measured?.width){if(++tries<10)requestAnimationFrame(go);return;}
        const w=n.measured.width,h=n.measured.height??0,view=api.visibleArea();
        if(!view)return;
        // AS LITTLE AS BRINGS IT IN (2026-11-28): centring the new node moved the rest of the canvas half a screen for a
        // node a few pixels over the edge, and the steps beside it went out of view. Each axis moves only by what is
        // over, with a margin; a node wider or taller than the view is aligned to its top left.
        const m=24,shift=(at:number,size:number,start:number,span:number)=>
          size+2*m>span?start+m-at:at<start+m?start+m-at:at+size>start+span-m?start+span-m-(at+size):0;
        const dx=shift(n.position.x,w,view.x,view.width),dy=shift(n.position.y,h,view.y,view.height);
        if(!dx&&!dy)return;
        const vp=flow.getViewport();
        void flow.setViewport({x:vp.x+dx*vp.zoom,y:vp.y+dy*vp.zoom,zoom:vp.zoom},{duration:200});};
        requestAnimationFrame(go);};
      callbacks.ready(api);
    },[]);
    return <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
      onNodeClick={(_,n)=>callbacks.select(n.id)}
      onFocusCapture={e=>{
        // FOCUS SELECTS, BY KEYBOARD: a widget reached by Tab becomes the selected one, so the Inspector follows the
        // keyboard and the arrow keys move what has the focus (the Section 508 audit, 2026-11-16).
        const el=e.target as HTMLElement;const id=el.classList?.contains('react-flow__node')?el.getAttribute('data-id'):null;
        if(id&&el.matches(':focus-visible')&&!el.classList.contains('selected'))callbacks.select(id);}} onPaneClick={e=>{const id=edgeAt(e.clientX,e.clientY);if(id)callbacks.selectEdge(id);else callbacks.clear();}}
      onNodeDragStop={(_,n)=>callbacks.move(n.id,n.position)} onConnect={c=>callbacks.connect(c)} isValidConnection={callbacks.valid}
      onNodesDelete={ns=>callbacks.remove(ns.map(n=>n.id))} onEdgesDelete={es=>callbacks.removeEdges(es.map(e=>e.id))}
      onEdgeClick={(_,e)=>callbacks.selectEdge(e.id)} onMove={(_,v)=>callbacks.zoom(v.zoom)}
      proOptions={{hideAttribution:true}} nodesDraggable={!busy} nodesConnectable={!busy} deleteKeyCode={busy?null:['Backspace','Delete']} minZoom={.3} maxZoom={1.8}
      connectionLineStyle={{stroke:'#176b59',strokeWidth:2}} fitViewOptions={{padding:.16}}>
      <Background color="#c8d3c1" gap={18} size={1}/>
    </ReactFlow>;
  }
  /** THE CONNECTION UNDER A CLICK ON THE CANVAS (gate 230, 2026-11-20). xyflow marks every connection `nopan`, so a drag
   *  begun on one never panned: the canvas stood still under the pointer. Connections now take no pointer events, a drag
   *  anywhere pans, and a click asks the browser which connection, if any, is under it. */
  function edgeAt(x:number,y:number):string|undefined{
    // The browser's own hit test, with connections taking the pointer for this one question: the same in every engine.
    container.classList.add('edges-hit');
    try{const g=document.elementFromPoint(x,y)?.closest('.react-flow__edge');
      return g?.getAttribute('data-id')??g?.getAttribute('data-testid')?.replace('rf__edge-','')??undefined;}
    finally{container.classList.remove('edges-hit');}
  }
  createRoot(container).render(<ReactFlowProvider><Flow/></ReactFlowProvider>);
  return api;
}
