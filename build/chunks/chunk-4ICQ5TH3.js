import{a as s}from"./chunk-WGB47PW5.js";import{b as f}from"./chunk-5YQI3WLW.js";function w(o){let e=n=>`<urn:fieldwork:canvas:node:${encodeURIComponent(n)}>`,i=`@prefix fw: <urn:fieldwork:>.
@prefix prov: <http://www.w3.org/ns/prov#>.
@prefix dct: <http://purl.org/dc/terms/>.
`;for(let n of o.nodes){let r=s.widgets.find(t=>t.nodeType===n.type);if(!r)throw new Error(`No semantic widget registration for ${n.type}`);let d=r.releases.find(t=>t.version===r.currentVersion);i+=`${e(n.id)} a fw:CanvasNodePlan, prov:Plan; dct:identifier ${JSON.stringify(n.id)}; fw:nodeType ${JSON.stringify(n.type)}; fw:widget <${r.id}>; fw:catalogVersion ${JSON.stringify(r.currentVersion)}; fw:catalogDigest ${JSON.stringify(d.sha256)}; fw:widgetDefinitionSource ${JSON.stringify(f)}; fw:configuration ${JSON.stringify(JSON.stringify(n.params))}.
<${r.id}> a fw:WidgetDefinition.
`}for(let n of o.edges)i+=`<urn:fieldwork:canvas:edge:${encodeURIComponent(n.id)}> a fw:CanvasConnection; fw:fromPlan ${e(n.from)}; fw:toPlan ${e(n.to)}; fw:inputPort ${JSON.stringify(n.port)}.
`;return i}export{w as a};
//# sourceMappingURL=chunk-4ICQ5TH3.js.map
