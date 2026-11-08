import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const arg=process.argv.indexOf('--out');const out=resolve(root,arg<0?'.makers/site':process.argv[arg+1]);
assert(out!==root && !root.startsWith(out+'/'),'Output must be separate from source');
await mkdir(out,{recursive:true});
const manifest=[];const copied=new Set();
async function copy(src,rel){const dest=resolve(out,rel);assert(dest.startsWith(out+'/'));await mkdir(dirname(dest),{recursive:true});await copyFile(src,dest);copied.add(rel);}
async function tree(folder,prefix='',filter=()=>true){for(const e of await readdir(folder,{withFileTypes:true})){const rel=prefix+e.name;if(e.isDirectory())await tree(resolve(folder,e.name),rel+'/',filter);else if(e.isFile()&&filter(rel))await copy(resolve(folder,e.name),rel);}}
// Explicit public runtime only. Source, tests, docs and historical PNG references stay private to the checkout.
for(const name of ['index.html','app.js','ui-text.js','grid-motion.js','visuals.js','visuals.css','styles.css','loading.js','loading.css','mondrian-engine.js','MONDRIAN-LICENSE.txt','progress-transfer.js','progress-contract.js','data/settings.json','data/settings.en.json'])await copy(resolve(root,name),name);
await tree(resolve(root,'assets/original'),'assets/original/');
await tree(resolve(root,'compatibility'));
await tree(resolve(root,'pages'));
const origin='https://macsetup.kai-nex.com';
const paths=['/'];
for(const rel of [...copied].filter(x=>x.endsWith('index.html')&&x!=='index.html'&&!x.includes('progress/')))paths.push('/'+rel.slice(0,-10));
await writeFile(resolve(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.sort().map(p=>'<url><loc>'+origin+p+'</loc></url>').join('')+'</urlset>\n');
await writeFile(resolve(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
await writeFile(resolve(out,'llms.txt'),'# MacSetup\n\n> Bilingual illustrated Mac settings and shortcuts guide by orocoa.\n\n- Website: '+origin+'/\n- English: '+origin+'/en/\n- Chinese guides: '+origin+'/guides/\n- English guides: '+origin+'/en/guides/\n- About and limits: '+origin+'/about/\n- Source: https://github.com/orocoa/macbook-setup-recommendations\n\n15 recommendations. Each includes steps, before/after, undo instructions and linked sources. Settings are changed manually; the checklist does not detect system state. Progress is local to the browser. Version review dates belong to individual entries; no universal macOS compatibility is claimed.\n');
await writeFile(resolve(out,'404.html'),'<!doctype html><html lang="en"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | MacSetup</title><body style="font:18px system-ui;margin:10vw"><h1>Page not found</h1><a href="/">MacSetup</a></body></html>');
await writeFile(resolve(out,'edgeone.json'),JSON.stringify({headers:[{source:'/*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Access-Control-Allow-Origin',value:'*'}]}]},null,2));
for(const rel of copied){if(rel.endsWith('.html')){const html=await readFile(resolve(out,rel),'utf8');assert(!html.includes('https://kai-nex.com/macsetup/'),'Old canonical '+rel);for(const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))JSON.parse(match[1]);}manifest.push({path:rel,sha256:createHash('sha256').update(await readFile(resolve(out,rel))).digest('hex')});}
await writeFile(resolve(out,'release.json'),JSON.stringify({name:'MacSetup',origin,files:manifest.sort((a,b)=>a.path.localeCompare(b.path))},null,2));
console.log(JSON.stringify({out,publicFiles:copied.size+6,sitemapUrls:paths.length}));
