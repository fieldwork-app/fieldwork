/** THE IDENTITY BUTTON (experiment 218, the spike of 2026-11-16): make your identity file, open it, lock it.
 *
 *  Apart from Credentials on purpose: an identity is not a credential. Until this, identity came only as a side effect
 *  of unlocking a GitHub token there, under a label that did not say so. The open identity is held here, in memory,
 *  and, encrypted, in this browser's storage so a reload keeps it (`session-keep.ts`); locked after ten idle minutes or
 *  at Lock. */
import {affiliationEditor,readAffiliationEditor} from './affiliations-ui.js';
import {createIdentityFile,openIdentityFile,updateIdentityFile,addSealingKey,validOrcid,validRor,sshPublicKey,keyPublished,type OpenIdentity} from './identity-file.js';
import {AVATAR_COLOURS,AVATAR_ICONS,avatarSvg,iconSvg,keyPatternSvg,type AvatarChoice} from './avatars.js';
import type {Escape} from './types.js';
import {validLogin} from './identity.js';
import {qrSvg} from './qr.js';
import {keep,restore,extend,drop,UNLOCKED_FOR_MS} from './session-keep.js';
import {keyText,fingerprint} from './sealed-file.js';

const IDLE_MS=UNLOCKED_FOR_MS;
let open:OpenIdentity|null=null;
/** Set for the dialog's next drawing after an identity is opened or made, so it says so where the person looks. */
let justOpened='';
let lastActivity=Date.now();
const listeners=new Set<()=>void>();

/** The identity open in this tab, or null. Asking counts as activity only through the person's own input. */
export function openIdentity():OpenIdentity|null{
  if(open&&Date.now()-lastActivity>=IDLE_MS)lock();
  return open;
}
/** THE IDENTITY, FOR SIGNING: a signature is a use of it, and keeps it open (2026-11-18). */
export function signingIdentity():OpenIdentity|null{const identity=openIdentity();if(identity)used();return identity;}
/** Counts as use: the lock warning's Keep them open. */
export function identityKeepOpen(){if(openIdentity())used();}
export function onIdentityChange(listener:()=>void){listeners.add(listener);}
/** Milliseconds until the open identity locks for want of use, or null when none is open. */
export function identityUntilLock():number|null{return open?Math.max(0,lastActivity+IDLE_MS-Date.now()):null;}
/** KEPT THROUGH A RELOAD while open (2026-11-16, `session-keep.ts`): the profile encrypted, the signing key as the
 *  non-exportable CryptoKey it is. Dropped the moment it locks. */
function set(next:OpenIdentity|null,kept=false){open=next;if(next)markOpenedHere();listeners.forEach(l=>l());
  if(next&&!kept)void keep('identity',{profile:next.profile,algorithm:next.algorithm,publicKey:next.publicKey,
    ...(next.sealing?{sealingPublicKey:next.sealing.publicKey}:{})},Date.now()+IDLE_MS,
    {privateKey:next.privateKey,...(next.sealing?{sealingKey:next.sealing.privateKey}:{})});
  if(!next)void drop('identity');}
let extendedAt=0;
/** Activity moves the kept identity's expiry on, at most twice a minute. */
function used(){lastActivity=Date.now();if(open&&lastActivity-extendedAt>30_000){extendedAt=lastActivity;void extend('identity',lastActivity+IDLE_MS);}}
/** A LINK TO GITHUB ONCE CONFIRMED, remembered on this device: the public key and the login, both public, and the day it
 *  was checked. So the dialog shows a linked key as one closed line (the practitioner, 2026-11-16: *"This section of the
 *  dialog does not always need to be exposed once SSH signing key is set up on GitHub"*). A check that no longer finds
 *  the key forgets it. */
const LINKS_KEY='fieldwork-identity-links-v1';
function readLinks():Record<string,{login:string;checked:string}>{
  try{const v=JSON.parse(localStorage.getItem(LINKS_KEY)||'{}');return v&&typeof v==='object'?v:{};}catch{return {};}
}
function linkedHere(publicKey:string,login:string):string|null{
  const hit=readLinks()[publicKey];
  return hit&&hit.login===login?new Date(hit.checked).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):null;
}
function rememberLink(publicKey:string,login:string,linked:boolean){
  const links=readLinks();
  if(linked)links[publicKey]={login,checked:new Date().toISOString()};else delete links[publicKey];
  try{localStorage.setItem(LINKS_KEY,JSON.stringify(links));}catch{/* a convenience only */}
}
/** WHETHER AN IDENTITY HAS BEEN OPENED ON THIS DEVICE: a yes, nothing of the identity, so the dialog can lead with Open
 *  for someone who has a file and with Make for someone who does not. */
const OPENED_KEY='fieldwork-identity-opened-v1';
function openedHere():boolean{try{return localStorage.getItem(OPENED_KEY)==='yes';}catch{return false;}}
function markOpenedHere(){try{localStorage.setItem(OPENED_KEY,'yes');}catch{/* a convenience only */}}
function lock(){if(open)set(null);}
/** The identity file, given to the person to keep. */
function saveIdentityFile(text:string,name:string){const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.download=identityFileName(name);a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),10_000);}

/** THE FILE'S NAME, easy to find in a folder (the practitioner, 2026-11-16: *"Need to automatically prefix the identify
 *  file with FWID-<name here>.fwid so it's easy to identify in a folder"*): FWID-, the name with spaces and punctuation as
 *  hyphens, .fwid. */
const fileNamePart=(name:string)=>name.replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'');
export const identityFileName=(name:string)=>`FWID-${fileNamePart(name)||'identity'}.fwid`;
/** A CREDENTIALS FILE NAMED TO MATCH (the practitioner, 2026-11-16: *"Yes to match"*): FWCRED-, the open identity's name
 *  where one is open, .fwcredentials. */
export const credentialsFileName=(name?:string)=>`FWCRED${name&&fileNamePart(name)?`-${fileNamePart(name)}`:''}.fwcredentials`;
/** THE PAGE A PHONE OPENS FROM THE QR CODE (2026-11-16: a code holding the key as plain text was offered as a web search):
 *  Fieldwork's own key.html, the key after #, which a browser never sends. On a published Fieldwork, this site's page;
 *  anywhere else (a local copy a phone cannot reach), the published one. */
export function keyPageUrl(ssh:string):string{
  const here=typeof location!=='undefined'&&location.protocol==='https:'?new URL('key.html',location.href).href
    :'https://fieldwork-app.github.io/fieldwork/key.html';
  return `${here}#k=${ssh.split(' ')[1]}`;
}
/** The name as a byline: the name, then the GitHub login and ORCID iD where the file carries them. */
export const identityLabel=(p:{name:string;login?:string;orcid?:string;affiliations?:{name:string}[]})=>
  [p.name,p.login?`@${p.login}`:'',p.orcid?`ORCID ${p.orcid}`:'',...(p.affiliations??[]).map(a=>a.name)].filter(Boolean).join(' · ');

const DIALOG=`<dialog id="identity-dialog" aria-labelledby="identity-title"><div class="dlg">
<div class="dlg-head"><h3 id="identity-title">Identity</h3></div>
<div class="dlg-body identity-body">
<p>Your identity file says who you are and holds the key that signs your notes, so anyone can check who wrote what.
It is yours to keep, like a key: Fieldwork never stores it. It holds no passwords or tokens for any service.</p>
<div class="identity-who"><span id="identity-avatar"></span><p id="identity-status" class="identity-status" role="status"></p></div>
<div class="result-switch identity-tabs" role="tablist" aria-label="Identity file">
<button type="button" role="tab" id="identity-tab-make" data-identity-tab="make" aria-controls="identity-create-part">Make my identity file</button>
<button type="button" role="tab" id="identity-tab-open" data-identity-tab="open" aria-controls="identity-open-part">Open my identity file</button></div>
<section id="identity-open-part" role="tabpanel" aria-labelledby="identity-tab-open">
<label class="field-label" for="identity-file">Identity file (.fwid)</label><input id="identity-file" type="file" accept=".fwid,application/json">
<label class="field-label" for="identity-passphrase">Passphrase</label><input id="identity-passphrase" type="password" autocomplete="off">
<button id="identity-open" class="button primary">Open</button>
<p id="identity-open-result" class="field-check" role="status" aria-live="polite"></p></section>
<section id="identity-create-part" role="tabpanel" aria-labelledby="identity-tab-make">
<label class="field-label" for="identity-name">Your name, as it should appear on a paper</label><input id="identity-name" maxlength="120">
<label class="field-label" for="identity-login">GitHub login (optional)</label>
<div class="lookup-row"><input id="identity-login" maxlength="39" autocomplete="off" aria-describedby="identity-login-check"><button type="button" class="button small" id="identity-login-lookup">Look up on GitHub</button></div>
<p id="identity-login-check" class="field-check" aria-live="polite"></p>
<label class="field-label" for="identity-orcid">ORCID iD (optional), such as 0000-0002-1825-0097</label>
<div class="lookup-row"><input id="identity-orcid" maxlength="19" autocomplete="off" aria-describedby="identity-orcid-check"><button type="button" class="button small" id="identity-orcid-lookup">Look up on ORCID</button></div>
<p id="identity-orcid-check" class="field-check" aria-live="polite"></p>
<div id="identity-new-affiliations"></div>
<label class="field-label" for="identity-new-passphrase">Passphrase, at least 12 characters</label><input id="identity-new-passphrase" type="password" autocomplete="new-password" aria-describedby="identity-length">
<p id="identity-length" class="field-check" aria-live="polite"></p>
<label class="field-label" for="identity-confirm">The passphrase again</label><input id="identity-confirm" type="password" autocomplete="new-password" aria-describedby="identity-match">
<p id="identity-match" class="field-check" aria-live="polite"></p>
<div id="identity-new-avatar"></div>
<p>If you lose the file or forget its passphrase, it cannot be recovered. Keep a copy somewhere safe.</p>
<p id="identity-create-error" class="field-check is-bad" role="alert" hidden></p>
<button id="identity-create" class="button primary">Make and save the file</button></section>
<details id="identity-github-part" class="identity-github" hidden><summary id="identity-github-summary">Link your key to GitHub</summary>
<p>So anyone can check that the notes you sign are yours, publish your key on your GitHub account as a <strong>signing
key</strong>. Only the public key leaves Fieldwork; it cannot be used to sign in to GitHub.</p>
<ol class="identity-steps">
<li>Copy your key: <code id="identity-ssh-key" class="identity-ssh-key"></code> <button type="button" class="button small" id="identity-ssh-copy">Copy</button>
<div class="identity-qr"><div id="identity-ssh-qr"></div><p>Or scan it with your phone, if GitHub is open there: it opens a page showing your key, with Copy and a button to GitHub. The key travels in the link and is not sent to any server.</p></div></li>
<li><a id="identity-ssh-open" href="https://github.com/settings/ssh/new" target="_blank" rel="noopener">Open GitHub's page for a new key</a>, signed in as <strong id="identity-ssh-login"></strong>.</li>
<li>Set <strong>Key type</strong> to <strong>Signing Key</strong>, paste the key, and press <strong>Add SSH key</strong>.</li>
<li>Then check: <button type="button" class="button small" id="identity-ssh-check">Check the link</button></li></ol>
<p id="identity-ssh-result" class="field-check" role="status" aria-live="polite"></p></details>
<details id="identity-sealing-part" class="identity-github" hidden><summary>Your key for encrypted files</summary>
<p>Backups are encrypted to this key while your identity is open. To let someone send you a file only you can open,
give them this key: it is public, so email or chat is fine. They add it under <strong>Also for</strong> when they back up.</p>
<p><code id="identity-sealing-key" class="identity-ssh-key"></code> <button type="button" class="button small" id="identity-sealing-copy">Copy</button></p>
<p>Fingerprint, to read aloud and check: <strong id="identity-sealing-print"></strong></p></details>
<details id="identity-avatar-part" hidden><summary>Change your avatar, ORCID iD or affiliations</summary>
<p>They are kept in your identity file, so changing them saves a new file to keep in place of the old one. Your key
stays the same. Choose the file and enter its passphrase.</p>
<div id="identity-change-avatar"></div>
<label class="field-label" for="identity-change-orcid">ORCID iD (optional), such as 0000-0002-1825-0097</label>
<input id="identity-change-orcid" maxlength="19" autocomplete="off">
<div id="identity-change-affiliations"></div>
<label class="field-label" for="identity-change-file">Identity file (.fwid)</label><input id="identity-change-file" type="file" accept=".fwid,application/json">
<label class="field-label" for="identity-change-passphrase">Passphrase</label><input id="identity-change-passphrase" type="password" autocomplete="off">
<div><button id="identity-change" class="button primary">Save the new file</button></div></details>
<p id="identity-error" class="is-failure" role="alert" hidden></p>
</div>
<div class="dlg-foot"><button id="identity-lock" class="button">Lock</button><button id="identity-close" class="button grow">Close</button></div>
</div></dialog>`;

/** THE CHOOSER: Fieldwork's icons, each drawn in the chosen colour, then the colours. Radios, so the keyboard works. */
function chooserMarkup(prefix:string,chosen:AvatarChoice|undefined,esc:Escape):string{
  const colour=chosen?.colour??'blue';
  return `<fieldset class="avatar-chooser"><legend>Your avatar (optional; your initials until you choose)</legend>`
    +`<div class="avatar-icons">${AVATAR_ICONS.map(i=>`<label class="avatar-option"><input type="radio" name="${prefix}-icon" value="${i.id}"${chosen?.icon===i.id?' checked':''}>`
      +`${iconSvg(i.id,colour,48)}<span>${esc(i.label)}</span></label>`).join('')}</div>`
    +`<div class="avatar-colours">${AVATAR_COLOURS.map(c=>`<label class="avatar-colour"><input type="radio" name="${prefix}-colour" value="${c.id}"${colour===c.id?' checked':''}>`
      +`<span class="swatch" style="background:${c.hex}"></span>${esc(c.label)}</label>`).join('')}</div></fieldset>`;
}
function chosenIn(root:HTMLElement,prefix:string):AvatarChoice|undefined{
  const icon=root.querySelector<HTMLInputElement>(`input[name="${prefix}-icon"]:checked`)?.value;
  const colour=root.querySelector<HTMLInputElement>(`input[name="${prefix}-colour"]:checked`)?.value;
  return icon&&colour?{icon,colour}:undefined;
}
/** A colour chosen redraws the icons in it, so the choice is seen as it will look. */
function wireChooser(root:HTMLElement,prefix:string,esc:Escape){
  root.querySelectorAll<HTMLInputElement>(`input[name="${prefix}-colour"]`).forEach(radio=>radio.onchange=()=>{
    root.innerHTML=chooserMarkup(prefix,{icon:chosenIn(root,prefix)?.icon??'',colour:radio.value},esc);wireChooser(root,prefix,esc);
    root.querySelector<HTMLInputElement>(`input[name="${prefix}-colour"][value="${radio.value}"]`)?.focus();});
}

export function installIdentity(button:HTMLButtonElement,esc:Escape){
  // THE AVATAR AND THE NAME, both: a picture alone says nothing to someone who cannot see it well.
  const label=()=>{button.innerHTML=open?`${avatarSvg(open.profile,28)}<span>${esc(open.profile.name)}</span>`
    :`<svg class="fw-avatar" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="9.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5.8 18.5a7 7 0 0 1 12.4 0" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span>Identity</span>`;
    button.setAttribute('aria-label',open?`Identity: ${open.profile.name}`:'Identity');};
  onIdentityChange(label);label();
  let redraw=()=>{};onIdentityChange(()=>redraw());
  // USE IS USE OF THE IDENTITY: working in its dialog, or signing (2026-11-18, as for the credentials). Until then any
  // click or key anywhere on the page counted, so an identity stayed open for as long as anyone worked in Fieldwork.
  for(const event of ['pointerdown','keydown'])document.addEventListener(event,e=>{
    if(open&&Date.now()-lastActivity>=IDLE_MS)lock();
    const d=document.querySelector('#identity-dialog');
    if(d&&e.target instanceof Node&&d.contains(e.target))used();},{capture:true});
  setInterval(()=>{if(open&&Date.now()-lastActivity>=IDLE_MS)lock();},10_000);
  // NOT LOCKED ON LEAVING THE PAGE any more: a reload keeps it, until 15 minutes without use or Lock.
  void restore<{profile:OpenIdentity['profile'];algorithm:OpenIdentity['algorithm'];publicKey:string;sealingPublicKey?:string}>('identity').then(kept=>{
    const privateKey=kept?.keys?.privateKey,sealingKey=kept?.keys?.sealingKey;
    if(!kept||!privateKey||open)return;
    const {sealingPublicKey,...value}=kept.value;
    lastActivity=kept.expiresAt-IDLE_MS;set({...value,privateKey,...(sealingPublicKey&&sealingKey?{sealing:{publicKey:sealingPublicKey,privateKey:sealingKey}}:{})},true);});
  button.onclick=()=>{
    if(!document.querySelector('#identity-dialog'))document.body.insertAdjacentHTML('beforeend',DIALOG);
    const d=document.querySelector<HTMLDialogElement>('#identity-dialog')!;
    const $=<T extends HTMLElement>(s:string)=>d.querySelector<T>(s)!;
    const error=$('#identity-error');
    // SAID WHERE THE PERSON IS LOOKING: a problem with making the file beside its button, not at the foot of the dialog.
    const fail=(message:string,at:HTMLElement=error)=>{at.textContent=message;at.hidden=false;at.scrollIntoView({block:'nearest'});};
    // THE PASSPHRASE CHECKED AS IT IS TYPED: its length, then whether the second matches the first.
    const checkPassphrase=()=>{
      const first=($('#identity-new-passphrase') as HTMLInputElement).value,again=($('#identity-confirm') as HTMLInputElement).value;
      const length=$('#identity-length'),match=$('#identity-match');
      length.textContent=!first?'':first.length<12?`${12-first.length} more character${12-first.length===1?'':'s'} needed.`:'Long enough.';
      length.className=`field-check ${first&&first.length<12?'is-bad':first?'is-good':''}`;
      match.textContent=!again?'':again===first?'The passphrases match.':first.startsWith(again)?'Keep typing: not the whole passphrase yet.':'The passphrases do not match.';
      match.className=`field-check ${!again?'':again===first?'is-good':first.startsWith(again)?'':'is-bad'}`;
      $('#identity-create-error').hidden=true;
    };
    for(const id of ['#identity-new-passphrase','#identity-confirm'])$(id).oninput=checkPassphrase;
    // IDENTIFIERS, CHECKED AS TYPED, offline: a GitHub login by GitHub's rule, an ORCID iD by its check digit.
    const mark=(el:HTMLElement,text:string,tone:''|'is-good'|'is-bad')=>{el.textContent=text;el.className=`field-check ${tone}`;};
    const checkLogin=()=>{const v=($('#identity-login') as HTMLInputElement).value.trim(),el=$('#identity-login-check');
      if(!v)return mark(el,'','');
      mark(el,validLogin(v)?'':'A GitHub login is letters, digits and single hyphens, up to 39, not starting or ending with a hyphen.',validLogin(v)?'':'is-bad');};
    const checkOrcid=()=>{const v=($('#identity-orcid') as HTMLInputElement).value.trim(),el=$('#identity-orcid-check');
      if(!v)return mark(el,'','');
      if(v.length<19)return mark(el,'Four groups of four, such as 0000-0002-1825-0097.','');
      mark(el,validOrcid(v)?'The check digit is right.':'The check digit does not match: a digit is mistyped.',validOrcid(v)?'is-good':'is-bad');};
    $('#identity-login').oninput=checkLogin;$('#identity-orcid').oninput=checkOrcid;
    // LOOKED UP ONLINE, ONLY WHEN ASKED: the name each service has on record, so the person sees whether it is theirs.
    // Found is not verified: anyone can type someone else's identifier.
    const lookup=async(url:string,el:HTMLElement,found:(j:Record<string,unknown>)=>string,missing:string)=>{
      mark(el,'Looking up…','');
      try{const r=await fetch(url,{headers:{Accept:'application/json'},cache:'no-store'});
        if(r.status===404)return mark(el,missing,'is-bad');
        if(!r.ok)return mark(el,`Could not look it up just now (the service answered ${r.status}).`,'');
        mark(el,found(await r.json() as Record<string,unknown>),'is-good');}
      catch{mark(el,'Could not reach the service: offline, or blocked. The identifier is kept as typed.','');}
    };
    $('#identity-login-lookup').onclick=()=>{const v=($('#identity-login') as HTMLInputElement).value.trim(),el=$('#identity-login-check');
      if(!validLogin(v))return checkLogin();
      void lookup(`https://api.github.com/users/${encodeURIComponent(v)}`,el,j=>`GitHub account found: @${String(j.login)}${j.name?`, ${String(j.name)}`:''}. Is this you?`,
        `No GitHub account named ${v}.`);};
    $('#identity-orcid-lookup').onclick=()=>{const v=($('#identity-orcid') as HTMLInputElement).value.trim(),el=$('#identity-orcid-check');
      if(!validOrcid(v))return checkOrcid();
      void lookup(`https://pub.orcid.org/v3.0/${v}/person`,el,j=>{
        const n=(j.name??{}) as {['given-names']?:{value?:string};['family-name']?:{value?:string};['credit-name']?:{value?:string}};
        const name=n['credit-name']?.value||[n['given-names']?.value,n['family-name']?.value].filter(Boolean).join(' ');
        return name?`ORCID record found: ${name}. Is this you?`:'ORCID record found; its name is not public.';},
        `No ORCID record with the iD ${v}.`);};
    // TWO STATES, NOT ONE FORM (the practitioner, 2026-11-16, of two avatar choosers and two save buttons on screen at
    // once): with no identity open, Make or Open, as two tabs; with one open, that identity only: linking it to GitHub,
    // changing its avatar, locking it.
    let tab:'make'|'open'='make';
    const draw=()=>{
      error.hidden=true;
      d.querySelector<HTMLElement>('.identity-tabs')!.hidden=!!open;
      for(const t of d.querySelectorAll<HTMLButtonElement>('[data-identity-tab]')){
        const on=t.dataset.identityTab===tab;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;
        $(`#${t.getAttribute('aria-controls')}`).hidden=!!open||!on;}
      $('#identity-status').innerHTML=open
        ?`${justOpened?`<span class="identity-done">✓ ${esc(justOpened)}</span> `:''}Open: <strong>${esc(identityLabel(open.profile))}</strong>. Notes you save now are signed (${esc(open.algorithm)}). It stays open through a reload, and locks after ${Math.round(IDLE_MS/60000)} minutes without use or when you press Lock.`
        :'No identity is open. Notes you save are kept with their versions, unsigned.';
      ($('#identity-lock') as HTMLButtonElement).disabled=!open;
      $('#identity-avatar').innerHTML=open?avatarSvg(open.profile,48)+`<span class="key-label">${keyPatternSvg(open.publicKey,28)} Your key</span>`:'';
      $('#identity-avatar-part').hidden=!open;
      $('#identity-sealing-part').hidden=!open?.sealing;
      if(open?.sealing){$('#identity-sealing-key').textContent=keyText(open.sealing.publicKey);
        void fingerprint(open.sealing.publicKey).then(f=>{$('#identity-sealing-print').textContent=f;});}
      // LINK TO GITHUB: offered once an identity with a GitHub login and an Ed25519 key is open.
      const ssh=open?sshPublicKey(open):null;
      $('#identity-github-part').hidden=!ssh||!open?.profile.login;
      if(ssh&&open?.profile.login){$('#identity-ssh-key').textContent=ssh;$('#identity-ssh-login').textContent=`@${open.profile.login}`;
        $('#identity-ssh-qr').innerHTML=qrSvg(keyPageUrl(ssh),200,'Your public key, as a link for your phone');
        // LINKED ALREADY: one line, closed, until the person opens it; not yet: open, with its steps.
        const linked=linkedHere(open.publicKey,open.profile.login);
        $('#identity-github-summary').textContent=linked?`✓ Linked to GitHub as @${open.profile.login} (checked ${linked})`:'Link your key to GitHub';
        ($('#identity-github-part') as HTMLDetailsElement).open=!linked;}
      if(open&&!$('#identity-change-avatar').innerHTML){$('#identity-change-avatar').innerHTML=chooserMarkup('change',open.profile.avatar,esc);
        wireChooser($('#identity-change-avatar'),'change',esc);
        affiliationEditor($('#identity-change-affiliations'),'change',open.profile.affiliations??[],esc);
        ($('#identity-change-orcid') as HTMLInputElement).value=open.profile.orcid??'';}
    };
    if(!$('#identity-new-avatar').innerHTML){$('#identity-new-avatar').innerHTML=chooserMarkup('new',undefined,esc);wireChooser($('#identity-new-avatar'),'new',esc);}
    if(!$('#identity-new-affiliations').innerHTML)affiliationEditor($('#identity-new-affiliations'),'new',[],esc);
    for(const t of d.querySelectorAll<HTMLButtonElement>('[data-identity-tab]'))t.onclick=()=>{tab=t.dataset.identityTab as 'make'|'open';draw();};
    tab=openedHere()?'open':'make';
    draw();redraw=draw;
    // WHAT OPENING DID, SAID UNDER THE BUTTON that was pressed (the practitioner, 2026-11-16: *"After I load file and
    // enter passphrase I do not get feedback whether the import was successful or not"*).
    const result=$('#identity-open-result');
    const said=(text:string,good:boolean)=>{result.textContent=text;result.className=`field-check ${good?'is-good':'is-bad'}`;
      result.scrollIntoView({block:'nearest'});};
    $('#identity-open').onclick=async()=>{
      const file=($('#identity-file') as HTMLInputElement).files?.[0];
      const pass=($('#identity-passphrase') as HTMLInputElement).value;
      if(!file){said('Choose your identity file first.',false);return;}
      if(!pass){said('Enter the passphrase for this file.',false);$('#identity-passphrase').focus();return;}
      said('Opening…',true);
      try{const text=await file.text();let identity=await openIdentityFile(text,pass);justOpened='Opened from your file.';
        // A FILE MADE BEFORE 2026-11-21 GAINS ITS KEY FOR ENCRYPTED BACKUPS (the export encryption audit), and is given back to keep.
        if(!identity.sealing){const added=await addSealingKey(text,pass);
          if(added){identity=added.identity;saveIdentityFile(added.file,identity.profile.name);
            justOpened=`Opened, and given a key for encrypted backups: keep the new ${identityFileName(identity.profile.name)} in place of the old one.`;}}
        set(identity);lastActivity=Date.now();justOpened='';
        ($('#identity-passphrase') as HTMLInputElement).value='';($('#identity-file') as HTMLInputElement).value='';result.textContent='';
        $('#identity-status').scrollIntoView({block:'nearest'});}
      catch(e){said(e instanceof Error?e.message:'The file could not be opened.',false);($('#identity-passphrase') as HTMLInputElement).select();}
    };
    for(const id of ['#identity-file','#identity-passphrase'])$(id).addEventListener('input',()=>{result.textContent='';});
    $('#identity-create').onclick=async()=>{
      const v=(s:string)=>($(s) as HTMLInputElement).value;
      const orcid=v('#identity-orcid').trim();
      const here=$('#identity-create-error');
      if(!v('#identity-name').trim()){fail('Write your name first: it is how your notes will be signed.',here);$('#identity-name').focus();return;}
      if(v('#identity-login').trim()&&!validLogin(v('#identity-login').trim())){fail(`${v('#identity-login').trim()} is not a GitHub login.`,here);$('#identity-login').focus();return;}
      if(orcid&&!validOrcid(orcid)){fail(`${orcid} is not an ORCID iD: its check digit does not match.`,here);$('#identity-orcid').focus();return;}
      const affiliations=readAffiliationEditor($('#identity-new-affiliations'));
      const badRor=affiliations.find(a=>a.ror&&!validRor(a.ror));
      if(badRor){fail(`${badRor.ror} is not a ROR ID: its checksum does not match.`,here);return;}
      if(v('#identity-new-passphrase').length<12){fail('The passphrase needs at least 12 characters.',here);$('#identity-new-passphrase').focus();return;}
      if(v('#identity-new-passphrase')!==v('#identity-confirm')){fail('The two passphrases do not match. Type the second again.',here);$('#identity-confirm').focus();return;}
      try{
        const avatar=chosenIn($('#identity-new-avatar'),'new');
        const {file,identity}=await createIdentityFile({name:v('#identity-name'),login:v('#identity-login'),...(orcid?{orcid}:{}),...(affiliations.length?{affiliations}:{}),...(avatar?{avatar}:{})},v('#identity-new-passphrase'));
        const a=document.createElement('a');
        a.href=URL.createObjectURL(new Blob([file],{type:'application/json'}));
        a.download=identityFileName(identity.profile.name);
        a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10_000);
        for(const s of ['#identity-new-passphrase','#identity-confirm'])($(s) as HTMLInputElement).value='';
        checkPassphrase();
        tab='open';
        justOpened=`Made and saved as ${identityFileName(identity.profile.name)}: keep it somewhere safe.`;set(identity);lastActivity=Date.now();justOpened='';
        $('#identity-status').scrollIntoView({block:'nearest'});
      }catch(e){fail(e instanceof Error?e.message:'The file could not be made.',$('#identity-create-error'));}
    };
    $('#identity-change').onclick=async()=>{
      const file=($('#identity-change-file') as HTMLInputElement).files?.[0];
      if(!file){fail('Choose your identity file first.');return;}
      try{
        const {file:next,identity}=await updateIdentityFile(await file.text(),($('#identity-change-passphrase') as HTMLInputElement).value,
          {avatar:chosenIn($('#identity-change-avatar'),'change')??null,affiliations:readAffiliationEditor($('#identity-change-affiliations')),
           orcid:($('#identity-change-orcid') as HTMLInputElement).value});
        if(open&&identity.publicKey!==open.publicKey){fail('That file is another identity, not the one open here.');return;}
        const a=document.createElement('a');
        a.href=URL.createObjectURL(new Blob([next],{type:'application/json'}));a.download=identityFileName(identity.profile.name);a.click();
        setTimeout(()=>URL.revokeObjectURL(a.href),10_000);
        ($('#identity-change-passphrase') as HTMLInputElement).value='';
        set(identity);lastActivity=Date.now();
      }catch(e){fail(e instanceof Error?e.message:'The file could not be changed.');}
    };
    $('#identity-sealing-copy').onclick=async()=>{if(!open?.sealing)return;
      try{await navigator.clipboard.writeText(keyText(open.sealing.publicKey));$('#identity-sealing-copy').textContent='Copied';}
      catch{const range=document.createRange();range.selectNodeContents($('#identity-sealing-key'));const sel=getSelection();sel?.removeAllRanges();sel?.addRange(range);
        $('#identity-sealing-copy').textContent='Selected: press Cmd or Ctrl C';}};
    $('#identity-ssh-copy').onclick=async()=>{const ssh=open&&sshPublicKey(open);if(!ssh)return;
      try{await navigator.clipboard.writeText(ssh);$('#identity-ssh-copy').textContent='Copied';}
      catch{const range=document.createRange();range.selectNodeContents($('#identity-ssh-key'));const sel=getSelection();sel?.removeAllRanges();sel?.addRange(range);
        $('#identity-ssh-copy').textContent='Selected: press Cmd or Ctrl C';}};
    $('#identity-ssh-check').onclick=async()=>{
      const el=$('#identity-ssh-result'),ssh=open&&sshPublicKey(open),login=open?.profile.login;
      const tell=(text:string,tone:string)=>{el.textContent=text;el.className=`field-check ${tone}`;};
      if(!ssh||!login)return;
      tell('Asking GitHub…','');
      try{const r=await fetch(`https://api.github.com/users/${encodeURIComponent(login)}/ssh_signing_keys`,{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});
        if(r.status===404)return tell(`GitHub has no account named @${login}.`,'is-bad');
        if(!r.ok)return tell(`GitHub answered ${r.status}; try again in a while.`,'');
        const hit=keyPublished(ssh,await r.json() as {key?:unknown;created_at?:unknown}[]);
        rememberLink(open!.publicKey,login,!!hit);
        tell(hit?`✓ Linked: @${login} has published this key on GitHub${hit.at?` (added ${new Date(hit.at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})})`:''}.`
          :`Not among @${login}'s signing keys yet. Check that the key type was Signing Key, then check again.`,hit?'is-good':'is-bad');
      }catch{tell('Could not reach GitHub: offline, or blocked.','');}
    };
    $('#identity-lock').onclick=lock;
    $('#identity-close').onclick=()=>d.close();
    d.showModal();
  };
}
