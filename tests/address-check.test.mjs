import test from 'node:test';
import assert from 'node:assert/strict';
import {addressSettings,addressProblems} from '../scripts/address-check.mjs';

/** SITE LINKS ARE HELD TO `homepage`, REPOSITORY LINKS TO `repository` (review of #4, 2026-11-27). The check had compared
 *  the owner only, so a homepage moved with the repository where it was let the old site links pass. */
const repository={type:'git',url:'https://github.com/fieldwork-app/fieldwork.git'};
const now=addressSettings({homepage:'https://fieldwork-app.github.io/fieldwork/',repository});
const README='Open [Fieldwork](https://fieldwork-app.github.io/fieldwork/?example=snow).\nCode: https://github.com/fieldwork-app/fieldwork/blob/main/README.md\nCORS origin: `https://fieldwork-app.github.io`';

test('as things are, the README passes',()=>{
  assert.deepEqual(addressProblems(README,now).other,[]);
});

test('a homepage moved to another path under the same owner finds the old site link, not the repository link',()=>{
  const moved=addressSettings({homepage:'https://fieldwork-app.github.io/app/',repository});
  const {other}=addressProblems(README,moved);
  assert.deepEqual(other.map(p=>[p.line,p.kind]),[[1,'site']]);
  // and the new path is recognized as right
  assert.deepEqual(addressProblems('See https://fieldwork-app.github.io/app/?example=snow',moved).other,[]);
});

test('a homepage moved to a custom domain finds the old Pages link, and takes links at the new one',()=>{
  const custom=addressSettings({homepage:'https://fieldwork.example.org/',repository});
  assert.deepEqual(addressProblems(README,custom).other.map(p=>[p.line,p.kind]),[[1,'site']]);
  assert.deepEqual(addressProblems('Open https://fieldwork.example.org/?example=snow',custom).other,[]);
});

test('the old owner is still found on both kinds of link',()=>{
  const {other}=addressProblems('https://digital-twin-ph.github.io/fieldwork/ and https://github.com/digital-twin-ph/fieldwork',now);
  assert.deepEqual(other.map(p=>p.kind).sort(),['repository','site']);
});

test('a source file that types the right address is reported as typing it',()=>{
  assert.equal(addressProblems("const u='https://fieldwork-app.github.io/fieldwork/';",now,{reads:true}).typed.length,1);
});
