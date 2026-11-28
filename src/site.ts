/** WHERE FIELDWORK LIVES, from one place: `package.json`'s `homepage` and `repository` (2026-11-27). The practitioner,
 *  after moving Fieldwork to fieldwork-app: *"Why don't we make the URLs templated so we can easily change URLs without
 *  having to hand edit many files?"* Everything the application links to of its own reads these; a file that cannot
 *  read them (the README, the schema's `$id`, the other repositories) is checked against them by
 *  `scripts/validate-addresses.mjs`. */
import project from '../package.json';

const repositoryUrl=project.repository.url.replace(/\.git$/,'').replace(/\/$/,'');

/** The published application, ending in a slash: `https://fieldwork-app.github.io/fieldwork/`. */
export const SITE_URL:string=project.homepage.endsWith('/')?project.homepage:`${project.homepage}/`;
/** The repository as owner/name: `fieldwork-app/fieldwork`. */
export const REPOSITORY:string=repositoryUrl.replace(/^https:\/\/github\.com\//,'');
/** The repository's page: `https://github.com/fieldwork-app/fieldwork`. */
export const REPOSITORY_URL:string=repositoryUrl;
/** A file on the repository's main branch, as GitHub shows it. */
export const repositoryFile=(path:string):string=>`${REPOSITORY_URL}/blob/main/${path}`;
/** A file on the repository's main branch, as its raw bytes. */
export const rawFile=(path:string):string=>`https://raw.githubusercontent.com/${REPOSITORY}/main/${path}`;
