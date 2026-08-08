const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const endpoint = 'http://127.0.0.1:9222';
const site = 'http://127.0.0.1:4173/';

class CDP {
  constructor(wsUrl) { this.wsUrl=wsUrl; this.ws=null; this.id=0; this.pending=new Map(); }
  async open() {
    this.ws=new WebSocket(this.wsUrl);
    await new Promise((resolve,reject)=>{this.ws.addEventListener('open',resolve,{once:true});this.ws.addEventListener('error',reject,{once:true});});
    this.ws.addEventListener('message',(e)=>{
      const msg=JSON.parse(e.data); if(!msg.id) return;
      const p=this.pending.get(msg.id); if(!p) return; this.pending.delete(msg.id);
      msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result);
    });
  }
  send(method,params={}) { const id=++this.id; this.ws.send(JSON.stringify({id,method,params})); return new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject})); }
  async eval(expression) {
    const out=await this.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});
    if(out.exceptionDetails){
      const d=out.exceptionDetails;
      const desc=d.exception?.description || d.text || 'Runtime exception';
      throw new Error(`${desc}\nEXPR: ${expression.slice(0,500)}`);
    }
    return out.result?.value;
  }
  close(){this.ws?.close();}
}

const assert=(ok,msg)=>{if(!ok) throw new Error(msg);};

async function getPage(){
  for(let i=0;i<80;i++){
    try{const r=await fetch(endpoint+'/json');if(r.ok){const pages=await r.json();const p=pages.find(x=>x.type==='page');if(p)return p;}}catch{}
    await sleep(200);
  }
  throw new Error('Chrome page target unavailable');
}

async function ready(cdp){
  for(let i=0;i<80;i++){if(await cdp.eval('document.readyState')==='complete'){await sleep(180);return;}await sleep(100);}throw new Error('Document not ready');
}

async function configure(cdp,{width,height,dpr,mobile,ua,label}){
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:dpr,mobile});
  await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:mobile,maxTouchPoints:mobile?5:1});
  await cdp.send('Network.setUserAgentOverride',{userAgent:ua,platform:mobile?'iPhone':'Linux x86_64'});
  await cdp.send('Page.navigate',{url:`${site}?audit=${encodeURIComponent(label)}-${Date.now()}`});
  await ready(cdp);
  const vp=await cdp.eval('({w:innerWidth,h:innerHeight,dpr:devicePixelRatio,coarse:matchMedia("(pointer: coarse)").matches,legacy:document.documentElement.classList.contains("press-fx-legacy-webkit")})');
  console.log(label,'viewport',JSON.stringify(vp));
  return vp;
}

async function auditNoOverflow(cdp,label){
  const d=await cdp.eval('({vw:document.documentElement.clientWidth,sw:document.documentElement.scrollWidth,bw:document.body.scrollWidth})');
  assert(d.sw-d.vw<=1 && d.bw-d.vw<=1,`${label}: horizontal overflow ${JSON.stringify(d)}`);
  console.log(label,'overflow OK',JSON.stringify(d));
}

async function auditProjectLines(cdp,label){
  const count=await cdp.eval("document.querySelectorAll('.project-mobile-separator').length");
  assert(count===4,`${label}: expected 4 Project separators, got ${count}`);
  for(let i=0;i<count;i++){
    const d=await cdp.eval(`(()=>{const p=document.querySelectorAll('.project-mobile-separator')[${i}];const s=p?.querySelector('span');if(!p||!s)return {missing:true};const pr=p.getBoundingClientRect(),sr=s.getBoundingClientRect(),cs=getComputedStyle(s),pc=getComputedStyle(p);return {missing:false,parentDisplay:pc.display,parentH:pr.height,display:cs.display,h:sr.height,w:sr.width,bg:cs.backgroundImage,opacity:cs.opacity};})()`);
    assert(!d.missing,`${label}: Project separator ${i+1} missing`);
    assert(d.parentDisplay!=='none',`${label}: Project separator ${i+1} container hidden`);
    assert(d.parentH>=43,`${label}: Project separator ${i+1} container ${d.parentH}px`);
    assert(d.display!=='none' && d.h>=0.8 && d.h<=1.5,`${label}: Project separator ${i+1} stroke not 1px (${JSON.stringify(d)})`);
    assert(d.w>=150,`${label}: Project separator ${i+1} stroke too narrow ${d.w}`);
    assert(d.bg && d.bg!=='none' && Number(d.opacity)>0,`${label}: Project separator ${i+1} visually transparent`);
  }
  console.log(label,'Project roadmap: 4 visible separator strokes OK');
}

async function auditCardTiming(cdp,label,legacy){
  const selectors=['.facts > div','.timeline-item','.project-card','.workshop-entry','.current-track-card','.practice-milestone','.knowledge-card','.contact-card'];
  const expectedName=legacy?'press-fx-sheen-legacy':'press-fx-sheen';
  for(const sel of selectors){
    const d=await cdp.eval(`(()=>{const el=document.querySelector(${JSON.stringify(sel)});if(!el)return {missing:true};el.dispatchEvent(new MouseEvent('click',{bubbles:true,button:0}));const layer=[...el.children].filter(x=>x.classList?.contains('press-fx-layer'));const sheen=layer[0]?.querySelector('.press-fx-sheen');const cs=sheen?getComputedStyle(sheen):null;return {missing:false,active:el.classList.contains('is-press-fx'),layers:layer.length,duration:cs?.animationDuration||'',name:cs?.animationName||''};})()`);
    assert(!d.missing,`${label}: missing ${sel}`);
    assert(d.active && d.layers===1,`${label}: ${sel} active=${d.active}, layers=${d.layers}`);
    assert(d.duration==='0.52s',`${label}: ${sel} duration=${d.duration}`);
    assert(d.name===expectedName,`${label}: ${sel} animation=${d.name}, expected=${expectedName}`);
    await sleep(570);
  }
  console.log(label,`card sheen: all families 0.52s / one layer / ${expectedName}`);
}

async function auditNestedRouting(cdp,label){
  const gateway=await cdp.eval(`(()=>{const b=document.querySelector('.workshop-entry-action'),card=b?.closest('.workshop-entry');if(!b||!card)return {missing:true};b.dispatchEvent(new MouseEvent('click',{bubbles:true,button:0}));const sheen=[...card.children].find(x=>x.classList?.contains('press-fx-layer'))?.querySelector('.press-fx-sheen');return {missing:false,cardActive:card.classList.contains('is-press-fx'),buttonTactile:b.classList.contains('press-fx-tactile-only'),duration:sheen?getComputedStyle(sheen).animationDuration:''};})()`);
  assert(!gateway.missing && gateway.cardActive && !gateway.buttonTactile && gateway.duration==='0.52s',`${label}: Workshop CTA routing ${JSON.stringify(gateway)}`);
  await sleep(570);
  const contact=await cdp.eval(`(()=>{const b=document.querySelector('.contact-card-action'),card=b?.closest('.contact-card');if(!b||!card)return {missing:true};b.dispatchEvent(new MouseEvent('click',{bubbles:true,button:0}));const sheen=[...card.children].find(x=>x.classList?.contains('press-fx-layer'))?.querySelector('.press-fx-sheen');return {missing:false,active:card.classList.contains('is-press-fx'),duration:sheen?getComputedStyle(sheen).animationDuration:''};})()`);
  assert(!contact.missing && contact.active && contact.duration==='0.52s',`${label}: Contact routing ${JSON.stringify(contact)}`);
  console.log(label,'nested card routing OK',JSON.stringify({gateway,contact}));
}

async function revealWorkshop(cdp){
  const d=await cdp.eval(`(()=>{const v=document.querySelector('[data-workshop-view]');const p=document.querySelector('.portfolio-panel');if(!v)return {missing:true};v.hidden=false;v.style.display='block';if(p)p.style.display='none';document.documentElement.classList.add('workshop-open');document.body.classList.add('workshop-open');return {missing:false,hidden:v.hidden,display:getComputedStyle(v).display};})()`);
  assert(!d.missing && d.hidden===false && d.display!=='none',`Workshop reveal failed ${JSON.stringify(d)}`);
  await sleep(120);
}

async function auditFoundation(cdp,label){
  const count=await cdp.eval("document.querySelectorAll('.workshop-grid-foundation > .knowledge-card').length");
  assert(count===4,`${label}: expected 4 Foundation cards, got ${count}`);
  const titles=[];
  for(let i=0;i<count;i++){
    const title=await cdp.eval(`document.querySelectorAll('.workshop-grid-foundation > .knowledge-card')[${i}]?.querySelector('h3')?.textContent?.trim()||''`);
    titles.push(title);
    const main=await cdp.eval(`(()=>{const card=document.querySelectorAll('.workshop-grid-foundation > .knowledge-card')[${i}];const svg=card?.querySelector('.knowledge-card-icon svg');if(!svg)return {missing:true};const r=svg.getBoundingClientRect(),cs=getComputedStyle(svg);return {missing:false,w:r.width,h:r.height,display:cs.display,stroke:cs.stroke,html:svg.innerHTML};})()`);
    assert(!main.missing && main.display!=='none' && main.w>=28 && main.h>=28,`${label}: ${title} main icon ${JSON.stringify(main)}`);
    for(let j=0;j<3;j++){
      const t=await cdp.eval(`(()=>{const card=document.querySelectorAll('.workshop-grid-foundation > .knowledge-card')[${i}];const icon=card?.querySelectorAll('.knowledge-topic-icon')[${j}];if(!icon)return {missing:true};const ps=getComputedStyle(icon,'::before'),r=icon.getBoundingClientRect();return {missing:false,mask:ps.maskImage||ps.webkitMaskImage||'none',w:r.width,h:r.height,display:getComputedStyle(icon).display};})()`);
      assert(!t.missing && t.mask && t.mask!=='none',`${label}: ${title} topic ${j+1} mask missing ${JSON.stringify(t)}`);
      assert(t.w>=30 && t.h>=30 && t.display!=='none',`${label}: ${title} topic ${j+1} geometry ${JSON.stringify(t)}`);
    }
    if(title==='Algorithms') assert(main.html.includes('<circle'),`${label}: Algorithms circular-flow SVG absent`);
    if(title==='LLMs & Chatbots') assert(main.html.includes('<circle')&&main.html.includes('<path'),`${label}: LLMs conversational SVG absent`);
  }
  assert(titles.includes('Algorithms')&&titles.includes('LLMs & Chatbots'),`${label}: Foundation titles ${JSON.stringify(titles)}`);
  console.log(label,'Foundation icons/masks OK',JSON.stringify(titles));
}

async function auditAllKnowledgeMasks(cdp,label){
  const cards=await cdp.eval("document.querySelectorAll('.knowledge-card').length");
  assert(cards>=7,`${label}: expected >=7 Knowledge cards, got ${cards}`);
  for(let i=0;i<cards;i++){
    const title=await cdp.eval(`document.querySelectorAll('.knowledge-card')[${i}]?.querySelector('h3')?.textContent?.trim()||''`);
    const topics=await cdp.eval(`document.querySelectorAll('.knowledge-card')[${i}]?.querySelectorAll('.knowledge-topic-icon').length||0`);
    assert(topics===3,`${label}: ${title} has ${topics} topic icons`);
    for(let j=0;j<topics;j++){
      const mask=await cdp.eval(`(()=>{const icon=document.querySelectorAll('.knowledge-card')[${i}]?.querySelectorAll('.knowledge-topic-icon')[${j}];if(!icon)return 'MISSING';const ps=getComputedStyle(icon,'::before');return ps.maskImage||ps.webkitMaskImage||'none';})()`);
      assert(mask!=='MISSING'&&mask!=='none',`${label}: ${title} topic ${j+1} has no semantic mask`);
    }
  }
  console.log(label,`all ${cards} Knowledge cards: semantic masks OK`);
}

async function runViewport(cdp,cfg){
  const vp=await configure(cdp,cfg);
  assert(vp.legacy===cfg.legacy,`${cfg.label}: legacy flag ${vp.legacy}, expected ${cfg.legacy}`);
  if(cfg.mobile) await auditProjectLines(cdp,cfg.label);
  await auditCardTiming(cdp,cfg.label,cfg.legacy);
  await auditNestedRouting(cdp,cfg.label);
  await auditNoOverflow(cdp,cfg.label+' HOME');
  await revealWorkshop(cdp);
  await auditFoundation(cdp,cfg.label);
  await auditAllKnowledgeMasks(cdp,cfg.label);
  await auditNoOverflow(cdp,cfg.label+' WORKSHOP');
}

async function main(){
  const page=await getPage(); const cdp=new CDP(page.webSocketDebuggerUrl); await cdp.open();
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');await cdp.send('Network.enable');
  await runViewport(cdp,{label:'DESKTOP',width:1440,height:1000,dpr:1,mobile:false,legacy:false,ua:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/150 Safari/537.36'});
  await runViewport(cdp,{label:'IPHONE13-PATH',width:390,height:844,dpr:3,mobile:true,legacy:false,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 Version/17.6 Mobile/15E148 Safari/604.1'});
  await runViewport(cdp,{label:'IPHONE-X-PATH',width:375,height:812,dpr:3,mobile:true,legacy:true,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 Version/16.7 Mobile/15E148 Safari/604.1'});
  cdp.close(); console.log('REGRESSION AUDIT 4.5.18 V7: OK');
}

main().catch((e)=>{console.error(e.stack||e);process.exit(1);});
