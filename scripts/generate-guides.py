"""Render every maintained MacSetup guide as readable bilingual HTML.

Keeps the existing app, setting data, system preferences and local checklist intact.
No new recommendation, external validation claim, image or runtime is generated.
"""
from pathlib import Path
import argparse, html, json, re, hashlib, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
E = lambda x: html.escape(str(x), quote=True)
CSS = '''/* Mac Setup document extension: retain its own system type and paper palette. */
:root{color-scheme:light;--paper:#fff;--ink:#111;--muted:#555;--gutter:32px;font-family:Inter,-apple-system,system-ui,"Segoe UI","PingFang SC",sans-serif}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-size:17px;line-height:1.65}a{color:inherit;text-underline-offset:4px}a:focus-visible{outline:2px solid var(--ink);outline-offset:4px}.skip{position:absolute;left:var(--gutter);top:-100px}.skip:focus{top:8px}header,footer{max-width:1120px;margin:auto;padding:28px var(--gutter);display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap}header a:first-child{font-size:24px;font-weight:600;text-decoration:none}nav{display:flex;gap:24px;align-items:center}main{max-width:960px;margin:44px auto 100px;padding:0 var(--gutter)}h1{font-size:clamp(28px,4vw,44px);line-height:1.2;letter-spacing:-.025em;max-width:25ch;font-weight:550;margin:20px 0}h2{font-size:26px;line-height:1.3;margin:0 0 20px;font-weight:550}h3{font-size:20px;font-weight:550}p{max-width:70ch}.intro{font-size:20px;max-width:58ch}.action{display:inline-block;margin:14px 0 28px;padding:12px 20px;background:var(--ink);color:var(--paper);text-decoration:none}section{margin-top:68px}li{margin:10px 0}dt{font-weight:600}dd{margin:4px 0 22px}table{border-collapse:collapse;width:100%;font-size:16px}th,td{text-align:left;border-bottom:1px solid #bbb;padding:12px;vertical-align:top}.table-wrap{overflow:auto}.guide-list{padding-left:24px}.guide-list li{margin:24px 0}.guide-list p{margin:6px 0}.context{color:var(--muted)}footer{color:var(--muted);font-size:15px}@media(max-width:600px){:root{--gutter:20px}header,footer{padding-top:20px;padding-bottom:20px}header nav{gap:16px;font-size:15px}main{margin-top:24px;margin-bottom:64px}h1{font-size:30px}h2{font-size:24px}.intro{font-size:18px}section{margin-top:48px}}
'''
CSS_ASSET="guides/documents-"+hashlib.sha256(CSS.encode()).hexdigest()[:16]+".css"
CSS_PATH="guides/documents.css"

# This file is appended to the existing imports and unchanged CSS definition.
IDENTITY = json.loads((ROOT/'scripts/macsetup-identity.json').read_text())
NAME = IDENTITY['name']

def product_entity(origin):
    return {'@type':'WebApplication','@id':origin+'#application',
            'name':NAME,'alternateName':IDENTITY['legacyNames'],'url':origin+'',
            'description':IDENTITY['zh-CN']['guideIntro'],
            'applicationCategory':'UtilitiesApplication','operatingSystem':'Web',
            'inLanguage':['zh-CN','en'],
            'creator':{'@type':'Person','name':'orocoa','url':'https://github.com/orocoa'},
            'sameAs':[IDENTITY['repository']],
            'hasPart':[{'@id':origin+p+'guides/#page'} for p in ['', 'en/']]}

def prose(value):
    if isinstance(value,str):return '<p>'+E(value)+'</p>'
    if isinstance(value,list):return '<ul>'+''.join('<li>'+prose(v)+'</li>' for v in value)+'</ul>'
    if isinstance(value,dict):return '<dl>'+''.join('<dt>'+E(k)+'</dt><dd>'+prose(v)+'</dd>' for k,v in value.items() if not str(k).startswith('_'))+'</dl>'
    return '<p>'+E(value)+'</p>'

def render(origin,path,other,title,description,content,lang,entity,entry=None):
    en=lang=='en';index=('en/' if en else '')+'guides/'
    zh=path.removeprefix('en/');url=origin+path
    meta_title=(IDENTITY['questions'][entry['id']][int(en)] if entry else title)+' | '+NAME
    article={'@type':entity,'@id':url+'#page','url':url,'name':title,'headline':title,
             'description':description,'inLanguage':lang,
             'isPartOf':{'@id':origin+index+'#page'} if entry else {'@id':origin+'#website'},
             'about':{'@id':origin+'#application'},
             'author':{'@type':'Person','name':'orocoa','url':'https://github.com/orocoa'}}
    if entry:article['citation']=[s['url'] for s in entry.get('sources',[])]
    else:
        article['mainEntity']={'@type':'ItemList','numberOfItems':15,
            'itemListElement':[{'@type':'ListItem','position':i+1,'name':x['title'],
                               'url':origin+index+x['id']+'/'} for i,x in enumerate(DATA[lang])]}
    product=product_entity(origin);product['description']=IDENTITY[lang]['guideIntro']
    graph=[{'@type':'WebSite','@id':origin+'#website','name':'MacSetup','url':origin},product,article,
           {'@type':'BreadcrumbList','itemListElement':[
               {'@type':'ListItem','position':1,'name':NAME,'item':origin+''},
               {'@type':'ListItem','position':2,'name':'Guides' if en else '设置指南','item':origin+index}
           ]+([] if not entry else [{'@type':'ListItem','position':3,'name':title,'item':url}])}]
    schema=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('<','\\u003c')
    alternates=''.join(f'<link rel="alternate" hreflang="{l}" href="{origin+p+zh}">' for l,p in [('zh-CN',''),('en','en/'),('x-default','')])
    return f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(meta_title)}</title><meta name="description" content="{E(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="{url}">{alternates}<meta property="og:type" content="{'article' if entry else 'website'}"><meta property="og:site_name" content="MacSetup"><meta property="og:locale" content="{'en_US' if en else 'zh_CN'}"><meta property="og:title" content="{E(meta_title)}"><meta property="og:description" content="{E(description)}"><meta property="og:url" content="{url}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="{E(meta_title)}"><meta name="twitter:description" content="{E(description)}"><link rel="stylesheet" href="/{CSS_PATH}"><script type="application/ld+json">{schema}</script></head><body><a class="skip" href="#main">{'Skip to content' if en else '跳到正文'}</a><header><a href="/">MacSetup</a><nav><a href="/{index}">{'Guides' if en else '设置指南'}</a><a href="/{other}" hreflang="{'zh-CN' if en else 'en'}">{'简体中文' if en else 'English'}</a></nav></header><main id="main"><article><h1>{E(title)}</h1><p class="intro">{E(description)}</p>{content}</article></main><footer><span>{'Change settings manually; progress stays in this browser.' if en else '设置需手动修改；进度保存在当前浏览器。'}</span><a href="{IDENTITY['repository']}">GitHub</a><a href="/{'en/' if en else ''}about/">{'About MacSetup' if en else '关于 MacSetup'}</a></footer></body></html>
'''

DATA={}
def generate(site,origin):
    origin=origin.rstrip('/')+'/';site=Path(site);paths=[]
    DATA.clear();DATA.update({l:json.loads((ROOT/'data'/f'settings{suffix}.json').read_text()) for l,suffix in [('zh-CN',''),('en','.en')]})
    assert len(DATA['zh-CN'])==len(DATA['en'])==15
    assert [x['id'] for x in DATA['zh-CN']]==[x['id'] for x in DATA['en']]
    assert set(IDENTITY['questions'])=={x['id'] for x in DATA['zh-CN']}
    for lang,entries in DATA.items():
        en=lang=='en';prefix='en/' if en else '';other='' if en else 'en/'
        for x in entries:
            path=prefix+'guides/'+x['id']+'/'
            action='/?lang='+lang+'&setting='+x['id']
            body='<a class="action" href="'+E(action)+'">'+('Open this setting' if en else '打开这项设置')+'</a>'
            body+='<p class="context">'+E(x['master_section'])+'</p>'
            for field,label in [('prerequisites','Before you start' if en else '开始前确认'),('change_paths','Settings path' if en else '设置路径')]:
                if x.get(field):body+='<section><h2>'+label+'</h2>'+(''.join('<p>'+E(' › '.join(a))+'</p>' for a in x[field]) if field=='change_paths' else prose(x[field]))+'</section>'
            body+='<section id="steps"><h2>'+('Steps' if en else '操作步骤')+'</h2><ol>'+''.join('<li>'+E(s)+'</li>' for s in x['steps'])+'</ol></section>'
            for field,label in [('before_state','Before' if en else '修改前'),('after_state','After' if en else '修改后'),('conflicts','Things to check' if en else '需要留意'),('shortcut_table','Keyboard shortcuts' if en else '键盘快捷键'),('restore_steps','Undo the change' if en else '恢复原设置')]:
                if x.get(field):
                    value=x[field]
                    content=('<div class="table-wrap"><table><thead><tr>'+''.join('<th scope="col">'+E(a)+'</th>' for a in value['headers'])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+E(a)+'</td>' for a in row)+'</tr>' for row in value['rows'])+'</tbody></table></div>') if field=='shortcut_table' else prose(value)
                    body+='<section'+(' id="restore"' if field=='restore_steps' else '')+'><h2>'+label+'</h2>'+content+'</section>'
            if x.get('sources'):
                body+='<section id="sources"><h2>'+('Sources and version notes' if en else '来源与版本说明')+'</h2><ul>'+''.join(f'<li><a href="{E(s["url"])}">{E(s["label"])}</a></li>' for s in x['sources'])+'</ul>'
                ed=x.get('_editorial',{});version=ed.get('path_reviewed_macos');date=ed.get('path_reviewed_on')
                if version and date:note=f'Path review: macOS {version}, {date}. Names and locations can differ on other releases.' if en else f'路径核对版本为 macOS {version}，日期 {date}；其他系统版本的名称与位置可能不同。'
                else:note='No dated macOS path review is recorded for this entry. Check your system version and the linked sources.' if en else '此条目未记录带日期的 macOS 路径核对；请结合自己的系统版本与来源确认。'
                body+='<p>'+E(note)+'</p></section>'
            body+='<section><h2>'+('More settings' if en else '其他设置')+'</h2><ul>'+''.join(f'<li><a href="/{prefix}guides/{a["id"]}/">{E(a["title"])}</a></li>' for a in entries if a['id']!=x['id'] and a['master_section']==x['master_section'])+f'<li><a href="/{prefix}guides/">'+('All 15 guides' if en else '全部 15 条指南')+'</a></li></ul></section>'
            target=site/path/'index.html';target.parent.mkdir(parents=True,exist_ok=True)
            target.write_text(render(origin,path,other+'guides/'+x['id']+'/',x['title'],x['description'],body,lang,'TechArticle',x));paths.append(path+'index.html')
        path=prefix+'guides/';copy=IDENTITY[lang]
        body='<a class="action" href="/?lang='+lang+'">'+('Open the interactive checklist' if en else '打开交互清单')+'</a><ol class="guide-list">'+''.join(f'<li><h2><a href="/{prefix}guides/{x["id"]}/">{E(x["title"])}</a></h2><p>{E(x["description"])}</p></li>' for x in entries)+'</ol>'
        body+='<section><h2>'+('Using the guide' if en else '如何使用这份指南')+'</h2><p>'+E(copy['manualNote'])+'</p><p>'+E(copy['sourceNote'])+'</p></section>'
        target=site/path/'index.html';target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(render(origin,path,other+'guides/',copy['guideTitle'],copy['guideIntro'],body,lang,'CollectionPage'));paths.append(path+'index.html')
    # Keep the original stylesheet and its immutable filename unchanged.
    (site/CSS_ASSET).write_text(CSS);(site/CSS_PATH).write_text('@import url("./'+Path(CSS_ASSET).name+'");\n')
    paths.extend([CSS_PATH,CSS_ASSET]);return paths

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--site',type=Path,default=ROOT/'pages');p.add_argument('--origin',default='https://macsetup.kai-nex.com/');a=p.parse_args()
    print(json.dumps(generate(a.site,a.origin),ensure_ascii=False))
