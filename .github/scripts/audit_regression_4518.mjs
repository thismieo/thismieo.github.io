import fs from 'node:fs';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const endpoint = 'http://127.0.0.1:9222';
const site = 'http://127.0.0.1:4173/';

async function waitForChrome() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(endpoint + '/json'); if (r.ok) return await r.json(); } catch {}
    await sleep(250);
  }
  throw new Error('Chrome remote debugging did not start');
}

class CDP {
  constructor(wsUrl) {
    this.id = 0;
    this.pending = new Map();
    this.ws = new WebSocket(wsUrl);
  }
  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
      this.ws.addEventListener('message', (e) => {
        const msg = JSON.parse(e.data);
        if (!msg.id) return;
        const p = this.pending.get(msg.id);
        if (!p) return;
        this.pending.delete(msg.id);
        if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
        else p.resolve(msg.result);
      });
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  async eval(expression, awaitPromise = true) {
    const out = await this.send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true, userGesture: true });
    if (out.exceptionDetails) throw new Error(out.exceptionDetails.text || 'Runtime exception');
    return out.result.value;
  }
  close() { this.ws.close(); }
}

async function ready(cdp) {
  for (let i = 0; i < 80; i++) {
    const state = await cdp.eval('document.readyState');
    if (state === 'complete') { await sleep(180); return; }
    await sleep(100);
  }
  throw new Error('Document did not become ready');
}

async function configure(cdp, {width, height, dpr, mobile, ua}) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: dpr, mobile });
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
  if (ua) await cdp.send('Network.setUserAgentOverride', { userAgent: ua, platform: mobile ? 'iPhone' : 'Linux x86_64' });
  await cdp.send('Page.navigate', { url: site + '?audit=4518-' + Date.now() });
  await ready(cdp);
}

const assert = (ok, msg) => { if (!ok) throw new Error(msg); };

async function auditProjectSeparators(cdp, label) {
  const data = await cdp.eval(`(() => {
    const nodes=[...document.querySelectorAll('.project-mobile-separator')];
    return nodes.map((p,i)=>{const s=p.querySelector('span');const pr=p.getBoundingClientRect();const sr=s?.getBoundingClientRect();const ps=getComputedStyle(p);const ss=s?getComputedStyle(s):null;return {i,parentDisplay:ps.display,parentH:pr.height,spanDisplay:ss?.display,spanH:sr?.height||0,spanW:sr?.width||0,bg:ss?.backgroundImage||'none',opacity:ss?.opacity||'0'};});
  })()`);
  assert(data.length === 4, `${label}: expected 4 Project mobile separators, got ${data.length}`);
  for (const x of data) {
    assert(x.parentDisplay !== 'none', `${label}: Project separator ${x.i+1} parent hidden`);
    assert(x.parentH >= 43, `${label}: Project separator ${x.i+1} container too short (${x.parentH})`);
    assert(x.spanDisplay !== 'none', `${label}: Project separator ${x.i+1} stroke hidden`);
    assert(x.spanH >= .8 && x.spanH <= 1.5, `${label}: Project separator ${x.i+1} stroke height ${x.spanH}`);
    assert(x.spanW >= 150, `${label}: Project separator ${x.i+1} stroke width ${x.spanW}`);
    assert(x.bg !== 'none', `${label}: Project separator ${x.i+1} has no visible gradient`);
    assert(Number(x.opacity) > 0, `${label}: Project separator ${x.i+1} opacity zero`);
  }
  console.log(label, 'Project separator strokes:', JSON.stringify(data));
}

async function openWorkshop(cdp) {
  await cdp.eval(`(() => { const b=document.querySelector('[data-open-workshop]'); if(!b) throw new Error('open workshop button missing'); b.click(); return true; })()`);
  await sleep(1350);
  const state = await cdp.eval(`({open:document.body.classList.contains('workshop-open'),hidden:document.querySelector('[data-workshop-panel]')?.hidden})`);
  assert(state.open && state.hidden === false, 'Workshop did not open for audit');
}

async function auditFoundationIcons(cdp, label) {
  const data = await cdp.eval(`(() => [...document.querySelectorAll('.workshop-grid-foundation > .knowledge-card')].map((card,ci)=>({
    title:card.querySelector('h3')?.textContent.trim(),
    main:(()=>{const svg=card.querySelector('.knowledge-card-icon svg');const r=svg.getBoundingClientRect();const cs=getComputedStyle(svg);return {w:r.width,h:r.height,display:cs.display,stroke:cs.stroke,html:svg.innerHTML};})(),
    topics:[...card.querySelectorAll('.knowledge-topic-icon')].map((icon)=>{const ps=getComputedStyle(icon,'::before');const r=icon.getBoundingClientRect();return {mask:ps.maskImage||ps.webkitMaskImage||'none',content:ps.content,w:r.width,h:r.height};})()
  })))()`);
  assert(data.length === 4, `${label}: expected 4 Foundation cards`);
  for (const card of data) {
    assert(card.main.display !== 'none' && card.main.w >= 28 && card.main.h >= 28, `${label}: main icon missing for ${card.title}`);
    assert(card.main.stroke !== 'none', `${label}: main icon stroke missing for ${card.title}`);
    assert(card.topics.length === 3, `${label}: expected 3 topic icons for ${card.title}`);
    for (const [i,t] of card.topics.entries()) {
      assert(t.mask && t.mask !== 'none', `${label}: topic icon ${i+1} in ${card.title} has no mask (solid-square regression)`);
      assert(t.w >= 30 && t.h >= 30, `${label}: topic icon box collapsed in ${card.title}`);
    }
  }
  const algorithms = data.find(x=>x.title==='Algorithms');
  const llm = data.find(x=>x.title==='LLMs & Chatbots');
  assert(algorithms?.main.html.includes('<circle'), `${label}: Algorithms circular-flow glyph not present`);
  assert(llm?.main.html.includes('<circle') && llm?.main.html.includes('<path'), `${label}: LLM conversational glyph not present`);
  console.log(label, 'Foundation icon audit:', JSON.stringify(data.map(x=>({title:x.title,masks:x.topics.map(t=>t.mask!=='none'),main:[x.main.w,x.main.h]}))));
}

async function auditCardTiming(cdp, label, legacyExpected=false) {
  const selectors=['.facts > div','.timeline-item','.project-card','.workshop-entry','.current-track-card','.practice-milestone','.knowledge-card','.contact-card'];
  const results=[];
  for (const sel of selectors) {
    const out = await cdp.eval(`(() => { const el=document.querySelector(${JSON.stringify(sel)}); if(!el) return {missing:true}; el.dispatchEvent(new MouseEvent('click',{bubbles:true,button:0})); const sheen=[...el.children].find(x=>x.classList?.contains('press-fx-layer'))?.querySelector('.press-fx-sheen'); const cs=sheen?getComputedStyle(sheen):null; return {active:el.classList.contains('is-press-fx'),duration:cs?.animationDuration||'',name:cs?.animationName||'',layers:[...el.children].filter(x=>x.classList?.contains('press-fx-layer')).length}; })()`);
    assert(!out.missing, `${label}: missing card family ${sel}`);
    assert(out.active, `${label}: ${sel} did not receive card sheen`);
    assert(out.layers === 1, `${label}: ${sel} has ${out.layers} press layers`);
    assert(out.duration === '0.52s', `${label}: ${sel} duration ${out.duration}, expected 0.52s`);
    assert(out.name === (legacyExpected?'press-fx-sheen-legacy':'press-fx-sheen'), `${label}: ${sel} animation ${out.name}`);
    results.push({sel,...out});
    await sleep(590);
  }
  console.log(label, 'Card timing:', JSON.stringify(results));
}

async function auditNestedCardTargets(cdp, label) {
  // Workshop CTA should pulse the Workshop card, not use 220ms tactile-only feedback.
  await cdp.send('Page.navigate', { url: site + '?audit=targets-' + Date.now() }); await ready(cdp);
  const gateway = await cdp.eval(`(() => {const b=document.querySelector('.workshop-entry-action');const card=b.closest('.workshop-entry');b.dispatchEvent(new MouseEvent('click',{bubbles:true,button:0}));const s=[...card.children].find(x=>x.classList?.contains('press-fx-layer'))?.querySelector('.press-fx-sheen');return {cardActive:card.classList.contains('is-press-fx'),buttonTactile:b.classList.contains('press-fx-tactile-only'),duration:s?getComputedStyle(s).animationDuration:''};})()`);
  assert(gateway.cardActive && gateway.duration==='0.52s', `${label}: Workshop CTA not routed to canonical card sheen`);
  await sleep(1200);
  // Contact action already intentionally routes to its parent card.
  const contact = await cdp.eval(`(() => {const b=document.querySelector('.contact-card-action');const card=b.closest('.contact-card');b.dispatchEvent(new MouseEvent('click',{bubbles:true,button:0}));const s=[...card.children].find(x=>x.classList?.contains('press-fx-layer'))?.querySelector('.press-fx-sheen');return {active:card.classList.contains('is-press-fx'),duration:s?getComputedStyle(s).animationDuration:''};})()`);
  assert(contact.active && contact.duration==='0.52s', `${label}: Contact action not routed to parent card sheen`);
  console.log(label, 'Nested card routing:', JSON.stringify({gateway,contact}));
}

async function auditOverflow(cdp, label) {
  const d=await cdp.eval(`({vw:document.documentElement.clientWidth,sw:document.documentElement.scrollWidth,body:document.body.scrollWidth})`);
  assert(d.sw-d.vw <= 1 && d.body-d.vw <= 1, `${label}: horizontal overflow ${JSON.stringify(d)}`);
  console.log(label, 'overflow:', JSON.stringify(d));
}

async function main() {
  const pages=await waitForChrome();
  const page=pages.find(x=>x.type==='page');
  if(!page) throw new Error('No Chrome page target');
  const cdp=new CDP(page.webSocketDebuggerUrl); await cdp.open();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable');

  await configure(cdp,{width:1440,height:1000,dpr:1,mobile:false,ua:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/150 Safari/537.36'});
  await auditCardTiming(cdp,'DESKTOP');
  await auditNestedCardTargets(cdp,'DESKTOP');
  await auditOverflow(cdp,'DESKTOP HOME');
  await openWorkshop(cdp); await auditFoundationIcons(cdp,'DESKTOP'); await auditOverflow(cdp,'DESKTOP WORKSHOP');

  await configure(cdp,{width:390,height:844,dpr:3,mobile:true,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 Version/17.6 Mobile/15E148 Safari/604.1'});
  await auditProjectSeparators(cdp,'PHONE390'); await auditCardTiming(cdp,'PHONE390'); await auditNestedCardTargets(cdp,'PHONE390'); await auditOverflow(cdp,'PHONE390 HOME');
  await openWorkshop(cdp); await auditFoundationIcons(cdp,'PHONE390'); await auditOverflow(cdp,'PHONE390 WORKSHOP');

  await configure(cdp,{width:375,height:812,dpr:3,mobile:true,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 Version/16.7 Mobile/15E148 Safari/604.1'});
  const legacyFlag=await cdp.eval(`document.documentElement.classList.contains('press-fx-legacy-webkit')`);
  assert(legacyFlag,'IPHONE-X-PATH: legacy WebKit path did not activate');
  await auditProjectSeparators(cdp,'IPHONE-X-PATH'); await auditCardTiming(cdp,'IPHONE-X-PATH',true); await auditOverflow(cdp,'IPHONE-X HOME');
  await openWorkshop(cdp); await auditFoundationIcons(cdp,'IPHONE-X-PATH'); await auditOverflow(cdp,'IPHONE-X WORKSHOP');

  cdp.close();
  console.log('DEEP REGRESSION AUDIT 4.5.18: OK');
}

main().catch(err=>{ console.error(err.stack||err); process.exit(1); });
