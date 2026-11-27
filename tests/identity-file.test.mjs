import test from 'node:test';
import assert from 'node:assert/strict';
import {SITE_URL} from './site.mjs';
const id=await import('../build/identity-file.js');
const {readNotes}=await import('../build/notes.js');

/** AN IDENTITY YOU CARRY, AND WHO DID WHAT (experiment 218, the spike of 2026-11-16). Fewer KDF rounds here than in
 *  the application, to keep the suite fast; the rounds are a parameter of the file and read back from it. */
const FAST={iterations:1000};
const PASS='a long enough passphrase';
const note={kind:'authored',id:'n1',section:'Results',fn:'finding',text:'Deaths per house were 8.4 times higher.',answers:'a'};

test('an ORCID iD is checked offline by its check digit',()=>{
  assert.equal(id.validOrcid('0000-0002-1825-0097'),true);
  assert.equal(id.validOrcid('0000-0002-1694-233X'),true);
  assert.equal(id.validOrcid('0000-0002-1825-0098'),false);
  assert.equal(id.validOrcid('0000-0002-1825'),false);
});

test('a file is made, sealed and opened again with its passphrase, and refused with another',async()=>{
  const {file,identity}=await id.createIdentityFile({name:' Ada ',login:'ada',orcid:'0000-0002-1825-0097'},PASS,FAST);
  assert.equal(identity.profile.name,'Ada');
  assert.ok(!file.includes('Ada')&&!file.includes('privateKey'),'nothing readable in the file');
  const back=await id.openIdentityFile(file,PASS);
  assert.deepEqual(back.profile,{name:'Ada',login:'ada',orcid:'0000-0002-1825-0097'});
  assert.equal(back.publicKey,identity.publicKey);
  assert.equal(back.privateKey.extractable,false,'the opened key signs and cannot be read out');
  await assert.rejects(id.openIdentityFile(file,'not the passphrase at all'),/passphrase does not open/);
  await assert.rejects(id.createIdentityFile({name:'Ada'},'short',FAST),/at least 12/);
  await assert.rejects(id.createIdentityFile({name:'Ada',orcid:'0000-0002-1825-0098'},PASS,FAST),/check digit/);
});

test('a file holding a secret for a service is refused: an identity is not a credential',async()=>{
  // Sealed by hand, as a tampered or foreign file would be.
  const enc=new TextEncoder(),subtle=crypto.subtle;
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const base=await subtle.importKey('raw',enc.encode(PASS),'PBKDF2',false,['deriveKey']);
  const key=await subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:1000},base,{name:'AES-GCM',length:256},false,['encrypt']);
  const {identity}=await id.createIdentityFile({name:'Ada'},PASS,FAST);
  const inner={profile:{name:'Ada',githubToken:'ghp_x'},key:{algorithm:identity.algorithm,publicKey:identity.publicKey,privateKey:'x'}};
  const b64=u=>btoa(String.fromCharCode(...new Uint8Array(u)));
  const data=await subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(inner)));
  const file=JSON.stringify({format:id.IDENTITY_FORMAT,kdf:{name:'PBKDF2',hash:'SHA-256',iterations:1000,salt:b64(salt)},cipher:{name:'AES-GCM',iv:b64(iv)},data:b64(data)});
  await assert.rejects(id.openIdentityFile(file,PASS),/holds a secret/);
});

test('both algorithms sign and verify; which one is kept with the key',async()=>{
  for(const prefer of [['Ed25519'],['ECDSA-P256']]){
    const {identity}=await id.createIdentityFile({name:'Ada'},PASS,{...FAST,prefer});
    assert.equal(identity.algorithm,prefer[0]);
    const v=await id.noteVersion(note,'2026-11-16T10:00:00Z',identity);
    assert.equal(await id.checkVersion(v),'verified',prefer[0]);
  }
});

test('a version is verified offline; changed words, time or signer fail; no identity, not signed',async()=>{
  const {identity}=await id.createIdentityFile({name:'Ada',login:'ada'},PASS,FAST);
  const v=await id.noteVersion(note,'2026-11-16T10:00:00Z',identity);
  assert.equal(v.by.login,'ada');
  assert.equal(await id.checkVersion(v),'verified');
  assert.equal(await id.checkVersion({...v,content:{...v.content,text:'Deaths per house were 9 times higher.'}}),'fails');
  assert.equal(await id.checkVersion({...v,at:'2026-11-17T10:00:00Z'}),'fails');
  assert.equal(await id.checkVersion({...v,by:{...v.by,name:'Somebody else'}}),'fails');
  const plain=await id.noteVersion(note,'2026-11-16T10:00:00Z',null);
  assert.equal(await id.checkVersion(plain),'unsigned');
  assert.equal(plain.digest,v.digest,'the same content, the same digest');
});

test('what is signed survives the round trip a project makes: stored, read back, the same bytes',async()=>{
  const {identity}=await id.createIdentityFile({name:'Ada'},PASS,FAST);
  const v=await id.noteVersion(note,'2026-11-16T10:00:00Z',identity);
  const travelled=JSON.parse(JSON.stringify({...note,versions:[v]}));
  const {notes:[back]}=readNotes([travelled]);
  assert.equal(back.versions.length,1);
  assert.equal(id.canonical(id.noteContent(back)),id.canonical(id.noteContent(note)));
  assert.equal(await id.checkVersion(back.versions[0]),'verified');
  assert.deepEqual(id.readNoteVersions([{at:'x',digest:'d',content:{},signature:'s'}]),[{at:'x',digest:'d',content:{}}],'a signature with no signer is dropped');
});

test('avatars: initials until chosen; a chosen icon kept in the file and changed by sealing it again, same key',async()=>{
  const av=await import('../build/avatars.js');
  assert.equal(av.initials('Ada Lovelace'),'AL');assert.equal(av.initials('  ada  '),'A');
  assert.match(av.avatarSvg({name:'Ada Lovelace'}),/>AL<\/text>/);
  assert.doesNotMatch(av.avatarSvg({name:'Ada',avatar:{icon:'pump',colour:'teal'}}),/<text/);
  const {file,identity}=await id.createIdentityFile({name:'Ada',avatar:{icon:'pump',colour:'teal'}},PASS,FAST);
  assert.deepEqual(identity.profile.avatar,{icon:'pump',colour:'teal'});
  const changed=await id.updateIdentityFile(file,PASS,{avatar:{icon:'tent',colour:'rust'}});
  assert.notEqual(changed.file,file);
  assert.equal(changed.identity.publicKey,identity.publicKey,'the same key');
  assert.deepEqual((await id.openIdentityFile(changed.file,PASS)).profile.avatar,{icon:'tent',colour:'rust'});
  assert.equal((await id.updateIdentityFile(changed.file,PASS,{avatar:null})).identity.profile.avatar,undefined);
  assert.equal((await id.createIdentityFile({name:'Ada',avatar:{icon:'nope',colour:'teal'}},PASS,FAST)).identity.profile.avatar,undefined,'an icon not in the set is not kept');
});
test('the key pattern: the same key, the same picture; another key, another picture',async()=>{
  const av=await import('../build/avatars.js');
  const a=await id.createIdentityFile({name:'Ada'},PASS,FAST),b=await id.createIdentityFile({name:'Ada'},PASS,FAST);
  assert.equal(av.keyPatternSvg(a.identity.publicKey),av.keyPatternSvg(a.identity.publicKey));
  assert.notEqual(av.keyPatternSvg(a.identity.publicKey),av.keyPatternSvg(b.identity.publicKey));
});

test('the key in SSH form for GitHub, and found among the keys an account lists, whatever the comment',async()=>{
  const {identity}=await id.createIdentityFile({name:'Ada Lovelace'},PASS,FAST);
  const ssh=id.sshPublicKey(identity);
  assert.match(ssh,/^ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI[A-Za-z0-9+/]{43} FWID Ada Lovelace$/);
  const [type,key]=ssh.split(' ');
  assert.deepEqual(id.keyPublished(ssh,[{key:'ssh-ed25519 AAAAother'},{key:`${type} ${key}`,created_at:'2026-11-16T10:00:00Z'}]),{at:'2026-11-16T10:00:00Z'});
  assert.equal(id.keyPublished(ssh,[{key:'ssh-ed25519 AAAAother'}]),null);
  const p256=await id.createIdentityFile({name:'Ada'},PASS,{...FAST,prefer:['ECDSA-P256']});
  assert.equal(id.sshPublicKey(p256.identity),null,'no SSH form written for P-256 yet');
});

test('the key reaches a phone as a link to key.html, the key after #; a QR code holds only an address',async()=>{
  const qr=await import('../build/qr.js');
  const {keyPageUrl}=await import('../build/identity-ui.js');
  const {identity}=await id.createIdentityFile({name:'Zoë'},PASS,FAST);
  const ssh=id.sshPublicKey(identity),url=keyPageUrl(ssh);
  assert.equal(url,`${SITE_URL}key.html#k=${ssh.split(' ')[1]}`);
  assert.ok(qr.qrMatrix(url).length>20);
  assert.throws(()=>qr.qrMatrix(ssh),/https address/,'never the key as text');
});

test('files named to be found in a folder: FWID- and FWCRED- with the name',async()=>{
  const {identityFileName,credentialsFileName}=await import('../build/identity-ui.js');
  assert.equal(identityFileName('Herman Tolentino, MD'),'FWID-Herman-Tolentino-MD.fwid');
  assert.equal(credentialsFileName('Herman Tolentino, MD'),'FWCRED-Herman-Tolentino-MD.fwcredentials');
  assert.equal(credentialsFileName(undefined),'FWCRED.fwcredentials');
  assert.equal(identityFileName('Zoë Ndiaye'),'FWID-Zoë-Ndiaye.fwid');
});

test('a ROR ID is checked by its checksum, bare or as an address; an affiliation without a name is dropped',()=>{
  assert.equal(id.validRor('03vek6s52'),true);assert.equal(id.validRor('https://ror.org/03vek6s52'),true);
  assert.equal(id.validRor('03vek6s53'),false);assert.equal(id.validRor('3vek6s52'),false);
  assert.deepEqual(id.readAffiliations([{name:' Harvard University ',ror:'https://ror.org/03VEK6S52'},{name:''},{name:'Clinic',ror:'03vek6s53'}]),
    [{name:'Harvard University',ror:'03vek6s52'},{name:'Clinic'}]);
});

test('affiliations go into the file, and changing them keeps the avatar; a bad ROR ID is refused',async()=>{
  const {file}=await id.createIdentityFile({name:'Ada',affiliations:[{name:'Harvard University',ror:'03vek6s52'}],avatar:{icon:'pump',colour:'teal'}},PASS,FAST);
  const opened=await id.openIdentityFile(file,PASS);
  assert.deepEqual(opened.profile.affiliations,[{name:'Harvard University',ror:'03vek6s52'}]);
  const {identity}=await id.updateIdentityFile(file,PASS,{affiliations:[{name:'Clinic'}]});
  assert.deepEqual(identity.profile.affiliations,[{name:'Clinic'}]);
  assert.deepEqual(identity.profile.avatar,{icon:'pump',colour:'teal'});
  await assert.rejects(()=>id.createIdentityFile({name:'Ada',affiliations:[{name:'X',ror:'03vek6s53'}]},PASS,FAST),/checksum/);
});
test('an ORCID iD added to an identity file later keeps the key; a wrong one is refused; empty removes it',async()=>{
  // A colleague made his file without an ORCID iD (2026-11-19); making a new file would have made a new key.
  const {file,identity}=await id.createIdentityFile({name:'Ada',affiliations:[{name:'Clinic'}]},PASS,FAST);
  assert.equal(identity.profile.orcid,undefined);
  const added=await id.updateIdentityFile(file,PASS,{orcid:'0000-0002-1825-0097'});
  assert.equal(added.identity.publicKey,identity.publicKey,'the same key');
  assert.equal((await id.openIdentityFile(added.file,PASS)).profile.orcid,'0000-0002-1825-0097');
  assert.deepEqual(added.identity.profile.affiliations,[{name:'Clinic'}],'what was not changed is kept');
  assert.equal((await id.updateIdentityFile(added.file,PASS,{avatar:null})).identity.profile.orcid,'0000-0002-1825-0097','left out, kept');
  await assert.rejects(()=>id.updateIdentityFile(file,PASS,{orcid:'0000-0002-1825-0098'}),/check digit/);
  assert.equal((await id.updateIdentityFile(added.file,PASS,{orcid:''})).identity.profile.orcid,undefined);
});
