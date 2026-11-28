/** WHERE FIELDWORK LIVES, for tests: read from package.json as src/site.ts reads it, so no test repeats the address. */
import {readFileSync} from 'node:fs';
const project=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
export const REPOSITORY_URL=project.repository.url.replace(/\.git$/,'').replace(/\/$/,'');
export const REPOSITORY=REPOSITORY_URL.replace(/^https:\/\/github\.com\//,'');
export const SITE_URL=project.homepage.endsWith('/')?project.homepage:`${project.homepage}/`;
export const rawFile=path=>`https://raw.githubusercontent.com/${REPOSITORY}/main/${path}`;
/** A string as a regular expression matching it literally. */
export const literally=text=>text.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&');
