from pathlib import Path

p = Path('/tmp/audit_regression_4518.mjs')
s = p.read_text(encoding='utf-8')

# Correct the actual Workshop root selector used by production HTML.
s = s.replace('[data-workshop-panel]', '[data-workshop-view]')

# After nested routing checks, reset to a clean Home document before the next phase.
tail = "  console.log(label, 'Nested card routing:', JSON.stringify({gateway,contact}));\n}"
tail_repl = "  console.log(label, 'Nested card routing:', JSON.stringify({gateway,contact}));\n  await cdp.send('Page.navigate', { url: site + '?audit=post-targets-' + Date.now() });\n  await ready(cdp);\n}"
if s.count(tail) != 1:
    raise SystemExit('home reset insertion point not unique')
s = s.replace(tail, tail_repl)

# Add a whole-Workshop semantic icon mask audit so square-mask regressions cannot hide
# in cards outside Foundation.
marker = 'async function auditCardTiming(cdp, label, legacyExpected=false) {'
extra = r'''async function auditAllKnowledgeMasks(cdp, label) {
  const data = await cdp.eval(`(() => [...document.querySelectorAll('.knowledge-card')].map(card=>({
    title:card.querySelector('h3')?.textContent.trim(),
    masks:[...card.querySelectorAll('.knowledge-topic-icon')].map(icon=>{const ps=getComputedStyle(icon,'::before');return ps.maskImage||ps.webkitMaskImage||'none';})
  })))()`);
  assert(data.length >= 7, `${label}: expected all Knowledge cards, got ${data.length}`);
  for (const card of data) {
    assert(card.masks.length === 3, `${label}: ${card.title} should have 3 semantic topic icons`);
    card.masks.forEach((mask,i)=>assert(mask && mask !== 'none', `${label}: ${card.title} topic ${i+1} has no mask`));
  }
  console.log(label, 'All Knowledge masks:', JSON.stringify(data.map(x=>({title:x.title,ok:x.masks.every(m=>m!=='none')}))));
}

'''
if s.count(marker) != 1:
    raise SystemExit('knowledge mask function insertion point not unique')
s = s.replace(marker, extra + marker)

for old, new, label in [
    ("await auditFoundationIcons(cdp,'DESKTOP'); await auditOverflow(cdp,'DESKTOP WORKSHOP');",
     "await auditFoundationIcons(cdp,'DESKTOP'); await auditAllKnowledgeMasks(cdp,'DESKTOP'); await auditOverflow(cdp,'DESKTOP WORKSHOP');",
     'desktop knowledge audit call'),
    ("await auditFoundationIcons(cdp,'PHONE390'); await auditOverflow(cdp,'PHONE390 WORKSHOP');",
     "await auditFoundationIcons(cdp,'PHONE390'); await auditAllKnowledgeMasks(cdp,'PHONE390'); await auditOverflow(cdp,'PHONE390 WORKSHOP');",
     'phone knowledge audit call'),
    ("await auditFoundationIcons(cdp,'IPHONE-X-PATH'); await auditOverflow(cdp,'IPHONE-X WORKSHOP');",
     "await auditFoundationIcons(cdp,'IPHONE-X-PATH'); await auditAllKnowledgeMasks(cdp,'IPHONE-X-PATH'); await auditOverflow(cdp,'IPHONE-X WORKSHOP');",
     'legacy knowledge audit call'),
]:
    if s.count(old) != 1:
        raise SystemExit(f'{label}: expected 1 match, found {s.count(old)}')
    s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')
print('Prepared stable 4.5.18 browser audit harness')
