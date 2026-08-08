from pathlib import Path

p = Path('/tmp/audit_regression_4518.mjs')
s = p.read_text(encoding='utf-8')

old = '''  const data = await cdp.eval(`(() => [...document.querySelectorAll('.workshop-grid-foundation > .knowledge-card')].map((card,ci)=>({
    title:card.querySelector('h3')?.textContent.trim(),
    main:(()=>{const svg=card.querySelector('.knowledge-card-icon svg');const r=svg.getBoundingClientRect();const cs=getComputedStyle(svg);return {w:r.width,h:r.height,display:cs.display,stroke:cs.stroke,html:svg.innerHTML};})(),
    topics:[...card.querySelectorAll('.knowledge-topic-icon')].map((icon)=>{const ps=getComputedStyle(icon,'::before');const r=icon.getBoundingClientRect();return {mask:ps.maskImage||ps.webkitMaskImage||'none',content:ps.content,w:r.width,h:r.height};})()
  })))()`);'''
new = '''  const data = await cdp.eval(`(() => [...document.querySelectorAll('.workshop-grid-foundation > .knowledge-card')].map((card,ci)=>({
    title:card.querySelector('h3')?.textContent.trim() || ('Foundation card ' + (ci+1)),
    main:(()=>{const svg=card.querySelector('.knowledge-card-icon svg'); if(!svg) return {missing:true,w:0,h:0,display:'none',stroke:'none',html:''}; const r=svg.getBoundingClientRect();const cs=getComputedStyle(svg);return {missing:false,w:r.width,h:r.height,display:cs.display,stroke:cs.stroke,html:svg.innerHTML};})(),
    topics:[...card.querySelectorAll('.knowledge-topic-icon')].map((icon,ii)=>{const ps=getComputedStyle(icon,'::before');const r=icon.getBoundingClientRect();return {i:ii+1,mask:ps.maskImage||ps.webkitMaskImage||'none',content:ps.content,w:r.width,h:r.height,display:getComputedStyle(icon).display};})()
  })))()`);'''
if s.count(old) != 1:
    raise SystemExit(f'Foundation audit expression: expected 1 match, found {s.count(old)}')
s = s.replace(old, new, 1)

old_assert = '''  for (const card of data) {
    assert(card.main.display !== 'none' && card.main.w >= 28 && card.main.h >= 28, `${label}: main icon missing for ${card.title}`);
    assert(card.main.stroke !== 'none', `${label}: main icon stroke missing for ${card.title}`);'''
new_assert = '''  console.log(label, 'Foundation raw diagnostics:', JSON.stringify(data.map(x=>({title:x.title,main:x.main,topics:x.topics.map(t=>({i:t.i,mask:t.mask!=='none',w:t.w,h:t.h,display:t.display}))}))));
  for (const card of data) {
    assert(!card.main.missing, `${label}: main SVG element missing for ${card.title}`);
    assert(card.main.display !== 'none' && card.main.w >= 28 && card.main.h >= 28, `${label}: main icon not visibly rendered for ${card.title} (${card.main.w}x${card.main.h}, ${card.main.display})`);
    assert(card.main.stroke !== 'none', `${label}: main icon stroke missing for ${card.title}`);'''
if s.count(old_assert) != 1:
    raise SystemExit(f'Foundation assertions: expected 1 match, found {s.count(old_assert)}')
s = s.replace(old_assert, new_assert, 1)

p.write_text(s, encoding='utf-8')
print('Hardened Foundation audit diagnostics')
