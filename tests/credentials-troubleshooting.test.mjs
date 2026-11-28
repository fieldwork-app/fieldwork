import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

/** "COULD NOT BE REACHED" HAS MORE THAN ONE CAUSE (review of PR #3, 2026-11-27). Fieldwork says it for any DHIS2 request
 *  that fails, an offline computer included, so the manual must not name a missing CORS entry as THE cause: it checks the
 *  address and the reach first, and asks the administrator about the allowlist after. */
test('the DHIS2 "could not be reached" entry checks address and reach before the CORS allowlist',()=>{
  const manual=readFileSync(new URL('../docs/surfaces/credentials.md',import.meta.url),'utf8');
  const start=manual.indexOf('- **DHIS2 says it could not be reached**');
  assert.ok(start>=0);
  const entry=manual.slice(start,manual.indexOf('\n- **',start+1));
  assert.doesNotMatch(entry,/could not be reached\*\*: the server does not list/);
  const address=entry.search(/server's address/),online=entry.search(/online/),cors=entry.search(/CORS/);
  assert.ok(address>=0&&online>address&&cors>online,'address, then reach, then CORS');
  assert.match(entry,/https:\/\/fieldwork-app\.github\.io/);
});
