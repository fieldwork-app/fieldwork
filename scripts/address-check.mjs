/** THE RULE validate-addresses.mjs applies to one file's text, apart so a test can give it any address (review of #4,
 *  2026-11-27). Two kinds of link name Fieldwork, and each is held to its own setting:
 *
 *  - the REPOSITORY, github.com/<owner>/<name> and raw.githubusercontent.com/<owner>/<name>, against `repository`;
 *  - the SITE, against `homepage`'s origin and path. A Pages address with Fieldwork's name under any owner
 *    (<owner>.github.io/<name>) is a site link, and so is any link at the homepage's own host; either must begin with the
 *    homepage. So a homepage moved to another path, or to a custom domain, with the repository where it was, still finds
 *    the old site links.
 *
 *  It had compared the owner only, so a Pages link was judged by the repository's owner, not by the homepage. */
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

export function addressSettings(project){
  const repositoryUrl=project.repository.url.replace(/\.git$/,'').replace(/\/$/,'');
  const [owner,name]=repositoryUrl.replace(/^https:\/\/github\.com\//,'').split('/');
  const site=new URL(project.homepage.endsWith('/')?project.homepage:`${project.homepage}/`);
  return {owner,name,site,siteBase:`${site.host}${site.pathname}`};
}

/** Each link in `text` naming Fieldwork somewhere other than where `settings` say, and, where `reads` holds, each that
 *  types the right address instead of reading it. Lines are 1-based. */
export function addressProblems(text,settings,{reads=false}={}){
  const {owner,name,site,siteBase}=settings;
  const repository=new RegExp(`(?:github\\.com|raw\\.githubusercontent\\.com)/([\\w-]+)/([\\w-]+)(?![\\w-])`,'g');
  // A Pages address under any owner whose first segment is Fieldwork's name, or anything at the homepage's host.
  const pages=new RegExp(`(?<![\\w.-])(?:[\\w-]+\\.github\\.io/${escape(name)}(?![\\w-])[^\\s)"'\`<>\\]]*|${escape(site.host)}(?![\\w.-])[^\\s)"'\`<>\\]]*)`,'g');
  const other=[],typed=[];
  text.split('\n').forEach((line,i)=>{
    for(const m of line.matchAll(repository)){
      if(m[2]!==name)continue;
      if(m[1]!==owner)other.push({line:i+1,link:m[0],kind:'repository'});
      else if(reads)typed.push({line:i+1,link:m[0],kind:'repository'});
    }
    for(const m of line.matchAll(pages)){
      const link=m[0].replace(/[.,;:]+$/,'');
      // The homepage's origin alone, as a CORS allowlist or a key's referrer names it, is the site's origin and right.
      if(link===site.host||link===`${site.host}/`)continue;
      if(!`${link}/`.startsWith(siteBase))other.push({line:i+1,link,kind:'site'});
      else if(reads)typed.push({line:i+1,link,kind:'site'});
    }
  });
  return {other,typed};
}
