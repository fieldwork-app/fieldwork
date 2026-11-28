/** ONE CONFIGURATION DIALOG, the same for every widget that has settings (experiment 186).
 *
 *  The practitioner, 2026-11-07: *"The Inspector modal dialog also has to have a consistent look, feel and behavior
 *  to it."* Counted that day: 24 dialogs, headed four ways, closed with four different words. So a widget's settings
 *  open in this, and this alone decides the heading, the close control, the order of the sections, where a message
 *  goes, the footer and what Escape does. A widget supplies what is inside the sections and what Apply writes.
 *
 *  Nothing reaches the workflow until Apply. The widget edits a draft; Cancel, × and Escape leave the step as it was,
 *  and ask first when the draft differs from what the step holds. */
import type {Escape} from './types.js';
import {errorMessage} from './guards.js';
import {scrollLongTables} from './long-tables.js';

export interface ConfigMessage {tone:'warning'|'refusal'; text:string}
export interface ConfigSections {
  /** What the step uses: its choices. */
  settings:string;
  /** How the result is presented: a title, precision, notes. Between Settings and Preview, so the preview shows it. */
  presentation?:string;
  /** What it will do, with these settings, to this data. */
  preview?:string;
  /** Anything the step will not decide for the person. */
  decisions?:string;
  /** One message, above the footer, saying what to change. */
  message?:ConfigMessage;
  /** Apply is disabled while this is set, and the reason is the message. */
  blocked?:boolean;
}
export interface ConfigDialog<D> {
  /** The dialog element's id, so a test and a manual can name it. */
  id:string;
  /** The widget's name, then the step's own: "Relate a column from another table · Terra LST". */
  widget:string; step:string;
  draft:D;
  sections:(draft:D)=>ConfigSections;
  /** Connects the controls inside the sections. `redraw` rebuilds them from the draft. */
  wire:(root:HTMLElement,draft:D,redraw:()=>void)=>void;
  apply:(draft:D)=>void;
  /** AN APPLY THAT TAKES TIME AND CAN FAIL: a read of a file (the Polygon layer, 2026-11-11). The dialog stays open while
   *  it runs, saying what it is doing through `say`; it closes when this resolves true, and stays open, its controls
   *  usable, when it resolves false or throws, with the reason as its message. Used instead of `apply` when given. */
  applyAsync?:(draft:D,say:(text:string,share?:number)=>void)=>Promise<boolean>;
  /** Called when the dialog closes without Apply: Cancel, ×, Escape or Discard. */
  onClose?:()=>void;
  /** Called before every rebuild of the sections, and before the dialog closes either way: release what `wire` mounted
   *  (Map's preview, a Leaflet map) while its box is still in the page. */
  beforeRedraw?:()=>void;
  /** A PUBLISHED THING SHOWN, NOT EDITED (experiment 192): every control disabled, and the footer is one Close. */
  readOnly?:boolean;
  /** Wider than a setting needs, for a body that is itself a form: the rules dialog. */
  wide?:boolean;
  /** A REPORT, NOT SETTINGS: the body is shown without the Settings, Preview and Decisions headings (what a run found
   *  on a step, 2026-11-12). Used with `readOnly`. */
  report?:boolean;
  /** THE BODY BUILT ONCE, never rebuilt: for a body that holds its own working state, a map and what is typed but not yet
   *  added (the pin editor, experiment 09, 2026-11-22). Asking to discard then changes the message, not the body; `wire`
   *  keeps the draft current, since only the draft is compared with what the step holds. */
  bodyOnce?:boolean;
}

export const CONFIG_APPLY='config-apply', CONFIG_CANCEL='config-cancel', CONFIG_CLOSE='config-close';

/** WHETHER A RUN IS IN FLIGHT, told by the application (2026-11-22). An edit made during a run is not made: the controls
 *  are disabled rather than queued, at the practitioner's decision. A dialog opened before the run began stays open, and
 *  its Apply was dropped without a word and the dialog closed as if it had applied (found by experiment 229's test, about
 *  one Apply in ten made just after another). Now Apply says why, and the dialog keeps the draft until the run is done. */
let runInFlight:()=>boolean=()=>false;
export function setRunInFlight(check:()=>boolean):void{runInFlight=check;}
/** APPLY WAITS FOR THE RUN, AND THEN APPLIES (2026-11-28). The practitioner chose, of an edit applied during a run: keep
 *  the dialog open and say to wait. It said so, and then kept saying so after the run was done, and nothing was applied
 *  until Apply was pressed again: an edit left there was lost when the dialog was closed (TODO, found 2026-11-27, Table's
 *  Presentation on Snow's geoprivacy example, 2 of 3 tries). Now Apply reads "Waiting for the run…" and applies the
 *  draft, as it stands then, when the application says the run is done. Cancel still cancels. */
const waitingForRun=new Set<()=>void>();
export function runSettled():void{for(const resume of [...waitingForRun])resume();}

export function openConfigDialog<D>(spec:ConfigDialog<D>,esc:Escape):void{
  document.getElementById(spec.id)?.remove();
  const dialog=document.createElement('dialog');
  dialog.id=spec.id;
  dialog.className=`config-dialog${spec.wide?' config-dialog-wide':''}`;
  dialog.setAttribute('aria-labelledby',`${spec.id}-title`);
  const draft:D=structuredClone(spec.draft);
  const held=JSON.stringify(spec.draft);
  let confirming=false;
  const changed=()=>JSON.stringify(draft)!==held;
  let applied=false,waiting=false;
  // ON RESUME, THE DRAFT AS IT NOW STANDS, AND ONLY IF IT CAN BE APPLIED (review of #7, 2026-11-28). A press made by code
  // does not take the focus from a text box as a press of the mouse does, so a caption typed while waiting and not yet
  // left was not in the draft: the focus is taken first, and the field commits as it would on leaving it. Then the form
  // is drawn again, without the wait, so a setting refused while waiting (an isochrone time of 0) keeps Apply disabled
  // and the dialog open with its refusal, rather than being pressed anyway and closing on an edit the workflow refuses.
  const resume=()=>{if(!waiting)return;if(runInFlight())return;waiting=false;waitingForRun.delete(resume);
    applyButton.textContent=applyLabel;
    const active=document.activeElement;
    if(active instanceof HTMLElement&&dialog.contains(active))active.blur();
    draw();
    if(applyButton.disabled)return;
    applyButton.click();};
  const close=()=>{waiting=false;waitingForRun.delete(resume);spec.beforeRedraw?.();dialog.close();dialog.remove();if(!applied)spec.onClose?.();};
  const WAIT_TEXT='The workflow is running. These settings will be applied when the run is done; Cancel keeps things as they were.';
  const waitMessage=()=>`<div class="config-message config-message-warning" role="status" data-run-in-flight><p>${WAIT_TEXT}</p></div>`;
  // CANCEL WHILE WAITING STOPS THE WAIT: nothing is applied when the run is done, and the draft is then kept or discarded
  // as any unapplied change is.
  const requestClose=()=>{if(waiting){waiting=false;waitingForRun.delete(resume);applyButton.textContent=applyLabel;}
    if(changed()&&!confirming){confirming=true;draw();return;}close();};

  const section=(name:string,body?:string)=>body
    ?`<section class="config-section" data-config-section="${name.toLowerCase()}"><h3>${name}</h3>${body}</section>`:'';

  // THE FRAME IS BUILT ONCE: heading, body, message and footer. Only the body and the message are rebuilt, so a text
  // box that commits on blur cannot replace the Apply button between the press and the click.
  // The step's own name after the widget's, unless it is still the widget's name: "Polygon layer · Polygon layer" says it twice.
  const named=spec.step.trim()&&spec.step.trim().toLowerCase()!==spec.widget.trim().toLowerCase();
  dialog.innerHTML=`<header class="config-head"><h2 id="${spec.id}-title">${esc(spec.widget)}`
    +(named?`<span class="config-step"> · ${esc(spec.step)}</span>`:'')+`</h2>`
    +`<button class="config-close" id="${CONFIG_CLOSE}" aria-label="Close">×</button></header>`
    +'<div class="config-body"></div><div class="config-message-slot"></div>'
    +(spec.readOnly
      ?`<footer class="config-foot"><button class="button" id="${CONFIG_CANCEL}">Close</button>`
        +`<button class="button primary" id="${CONFIG_APPLY}" hidden>Apply</button></footer>`
      :`<footer class="config-foot"><button class="button" id="${CONFIG_CANCEL}">Cancel</button>`
        +`<button class="button primary" id="${CONFIG_APPLY}">Apply</button></footer>`);
  const body=dialog.querySelector<HTMLElement>('.config-body')!;
  const slot=dialog.querySelector<HTMLElement>('.config-message-slot')!;
  const applyButton=dialog.querySelector<HTMLButtonElement>(`#${CONFIG_APPLY}`)!;
  dialog.querySelector<HTMLButtonElement>(`#${CONFIG_CLOSE}`)!.onclick=requestClose;
  dialog.querySelector<HTMLButtonElement>(`#${CONFIG_CANCEL}`)!.onclick=requestClose;
  const cancelButton=dialog.querySelector<HTMLButtonElement>(`#${CONFIG_CANCEL}`)!;
  const applyLabel=applyButton.textContent??'Apply';
  applyButton.onclick=async()=>{
    if(applyButton.disabled||spec.readOnly)return;
    if(runInFlight()){waiting=true;waitingForRun.add(resume);slot.innerHTML=waitMessage();
      applyButton.disabled=true;applyButton.textContent='Waiting for the run\u2026';return;}
    if(!spec.applyAsync){applied=true;spec.apply(draft);close();return;}
    // A SHARE, WHERE THE WORK KNOWS ONE, IS DRAWN AS A BAR under the words (2026-11-14).
    const say=(text:string,tone:'info'|'failure'='info',share?:number)=>{slot.innerHTML=text
      ?`<div class="config-message config-message-${tone}" role="${tone==='failure'?'alert':'status'}"><p>${esc(text)}</p>`
        +(share!==undefined&&Number.isFinite(share)
          ?`<div class="config-progress" role="progressbar" aria-label="${esc(text)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(share*100)}"><div style="width:${(Math.max(0,Math.min(1,share))*100).toFixed(1)}%"></div></div>`:'')
        +'</div>':'';};
    applyButton.disabled=true;cancelButton.disabled=true;const was=applyButton.textContent;applyButton.textContent='Working\u2026';
    try{
      if(await spec.applyAsync(draft,(text,share)=>say(text,'info',share))){applied=true;close();return;}
    }catch(error){say(errorMessage(error),'failure');}
    applyButton.textContent=was;applyButton.disabled=false;cancelButton.disabled=false;
  };

  let built=false;
  // A REDRAW ASKED FOR DURING A REDRAW runs after it, never inside it (2026-11-22): replacing the body removes the field
  // that has focus, the browser then fires that field's change, and a change redraws. Nested, the second replacement
  // found its node already gone and threw.
  let drawing=false,again=false;
  function draw(){
    if(drawing){again=true;return;}
    drawing=true;
    try{drawNow();}finally{drawing=false;}
    if(again){again=false;draw();}
  }
  function drawNow(){
    // WHERE THE PERSON WAS, kept across the rebuild: the element with focus by id, and the caret in a text box.
    const active=document.activeElement as HTMLInputElement|null;
    const focusId=active&&body.contains(active)?active.id:'';
    const caret=focusId&&typeof active?.selectionStart==='number'?active.selectionStart:null;
    const scroll=body.scrollTop;

    const parts=spec.sections(draft);
    const rebuild=!(spec.bodyOnce&&built);built=true;
    if(rebuild)spec.beforeRedraw?.();
    if(rebuild)body.innerHTML=spec.report?`<section class="config-section" data-config-section="report">${parts.settings}</section>`
      :section('Settings',parts.settings)+section('Presentation',parts.presentation)+section('Preview',parts.preview)+section('Decisions',parts.decisions);
    slot.innerHTML=confirming
      ?`<div class="config-message config-message-warning" role="alert"><p>These changes are not applied. Discard them?</p>`
        +`<div class="config-message-actions"><button class="button" id="config-keep-editing">Keep editing</button>`
        +`<button class="button danger" id="config-discard">Discard changes</button></div></div>`
      :parts.message
        ?`<div class="config-message config-message-${parts.message.tone}" role="alert"><p>${esc(parts.message.text)}</p></div>`
        :waiting?waitMessage():'';
    applyButton.disabled=!!parts.blocked||confirming||waiting;
    const keep=slot.querySelector<HTMLButtonElement>('#config-keep-editing');
    if(keep){keep.onclick=()=>{confirming=false;draw();};keep.focus();}
    const discard=slot.querySelector<HTMLButtonElement>('#config-discard');
    if(discard)discard.onclick=close;
    if(!rebuild)return;
    spec.wire(body,draft,()=>{confirming=false;draw();});
    scrollLongTables(body);
    // READ ONLY: shown exactly as it would be edited, every control disabled and nothing to add or remove.
    if(spec.readOnly){body.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('input:not([data-keep-enabled]),select,textarea:not([data-keep-enabled])')
      .forEach(el=>{el.disabled=true;});body.querySelectorAll('button[data-part],button[data-editor-add]').forEach(el=>el.remove());}

    body.scrollTop=scroll;
    if(focusId&&!confirming){
      const back=body.querySelector<HTMLInputElement>(`#${CSS.escape(focusId)}`);
      if(back){back.focus();if(caret!==null&&typeof back.setSelectionRange==='function'){
        try{back.setSelectionRange(caret,caret);}catch{/* a select or number box has no caret */}}}
    }
  }

  draw();
  document.body.append(dialog);
  dialog.addEventListener('cancel',event=>{event.preventDefault();requestClose();});
  dialog.showModal();
  // OPENS ON THE FIRST SETTING, not on ×: a keyboard user starts where the work is.
  // THE FIRST SETTING, not Show me how it works (experiment 223), which explains the settings and is not one of them.
  dialog.querySelector<HTMLElement>('[data-config-section="settings"] :is(select,input,textarea,button):not([disabled]):not([data-show-me])')?.focus();
}
