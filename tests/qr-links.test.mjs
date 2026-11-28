import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {qrMatrix,qrSvg} from '../build/qr.js';
import {catalogLinks,builtInLinks,exampleLinksBlock,exampleSlug,FIELDWORK_URL} from '../build/example-links.js';
import {SITE_URL,REPOSITORY_URL,literally} from './site.mjs';

// QR CODES IN A WORKED EXAMPLE'S WRITE-UP (experiment 203). Lab check 47 reads every code back with OpenCV; this checks
// what the addresses are and that the encoder is held to one https address.
const catalog=JSON.parse(readFileSync(new URL('../widgets/examples.json',import.meta.url),'utf8')).examples;

test('a catalog example: Fieldwork with it opened, and its repository at the pinned commit',()=>{
  const oswego=catalog.find(e=>e.id==='urn:fieldwork:example:oswego-1940');
  const links=catalogLinks(oswego);
  assert.equal(links.app,`${FIELDWORK_URL}?example=oswego-1940`);
  assert.equal(links.files,`${oswego.repository}/tree/${oswego.commit}`);
  assert.equal(links.pinned,true);
  assert.equal(exampleSlug('urn:fieldwork:example:sierra-leone-measles'),'sierra-leone-measles');
});

test('a built-in example: its files on main, said to be the latest and not pinned; a project of its own gets none',()=>{
  const links=builtInLinks({id:'hagelloch-1861',name:'Measles in Hagelloch, 1861',workflows:['hagelloch']},'hagelloch');
  assert.equal(links.app,`${FIELDWORK_URL}?example=hagelloch`);
  assert.equal(links.files,`${REPOSITORY_URL}/tree/main/examples/hagelloch-1861`);
  assert.equal(links.pinned,false);
  assert.equal(builtInLinks({id:'heat-outreach',name:'Heat',workflows:['heat']},'heat'),null);
  const html=exampleLinksBlock([links],s=>s);
  assert.equal((html.match(/<svg class="qr-code"/g)||[]).length,2);
  assert.match(html,/the latest version, not pinned/);
  assert.match(html,new RegExp(`<a href="${literally(SITE_URL)}\\?example=hagelloch">`));
  assert.equal(exampleLinksBlock([],s=>s),'');
});

test('the code holds one https address in plain ASCII, black on white, with its quiet zone',()=>{
  const m=qrMatrix(SITE_URL);
  assert.equal(m.length%4,1,'a QR code is 4n+17 modules a side');
  assert.throws(()=>qrMatrix('http://example.org'),/one https address/);
  assert.throws(()=>qrMatrix('https://example.org/ü'),/plain ASCII/);
  const svg=qrSvg(SITE_URL);
  assert.match(svg,new RegExp(`viewBox="0 0 ${m.length+8} ${m.length+8}"`));
  assert.match(svg,/fill="#ffffff".*fill="#000000"/);
});
