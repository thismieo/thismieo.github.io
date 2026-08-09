from pathlib import Path

index_path = Path('index.html')
visual_path = Path('visual-system.css')
index = index_path.read_text(encoding='utf-8')
visual = visual_path.read_text(encoding='utf-8')

assert 'visual-system.css?v=1.5.11' in index
assert 'Shared Visual System 1.5.11' in visual

old_contact = '<span class="section-intro-primary">I’m always open to learning, sharing ideas and connecting with people interested in technology and AI.</span>'
new_contact = '<span class="section-intro-primary contact-intro-primary"><span class="contact-copy-line">I’m always open to learning, sharing ideas and</span> <span class="contact-copy-line">connecting with people interested in technology and AI</span></span>'
assert old_contact in index
index = index.replace(old_contact, new_contact, 1)

old_primary = '<p class="closing-message-primary">This is where I document what I learn, build and improve: one concept and one project at a time</p>'
new_primary = '<p class="closing-message-primary"><span class="closing-copy-line">This is where I document what I learn,</span> <span class="closing-copy-line">build and improve: one concept and one project at a time</span></p>'
assert old_primary in index
index = index.replace(old_primary, new_primary, 1)

old_secondary = '<p class="closing-message-secondary">I hope it grows into a home for my work, future projects and meaningful collaborations with people, companies and organizations in Iraq and around the world</p>'
new_secondary = '<p class="closing-message-secondary"><span class="closing-copy-line">I hope it grows into a home for my work, future projects</span> <span class="closing-copy-line">and meaningful collaborations with people,</span> <span class="closing-copy-line">companies and organizations in Iraq and around the world.</span></p>'
assert old_secondary in index
index = index.replace(old_secondary, new_secondary, 1)

marker = '''.portfolio-panel #contact .section-intro { --intro-start: #9db5b5; --intro-end: #a99cba; }\n\n'''
addition = '''.portfolio-panel #contact .section-intro { --intro-start: #9db5b5; --intro-end: #a99cba; }\n\n.portfolio-panel .contact-copy-line,\n.portfolio-panel .closing-copy-line { display: inline; }\n\n'''
assert marker in visual
visual = visual.replace(marker, addition, 1)

mobile_marker = '''  .portfolio-panel .section-intro-secondary {\n    font-size: clamp(.79rem, 3.34vw, .86rem);\n    line-height: 1.65;\n  }\n\n\n  .portfolio-panel .closing-note h2 {\n'''
mobile_addition = '''  .portfolio-panel .section-intro-secondary {\n    font-size: clamp(.79rem, 3.34vw, .86rem);\n    line-height: 1.65;\n  }\n\n  .portfolio-panel #contact .section-intro {\n    width: calc(100% + 16px);\n    max-width: calc(100vw - 20px);\n  }\n\n  .portfolio-panel #contact .contact-intro-primary {\n    max-width: none;\n    font-size: clamp(.74rem, 3.15vw, .86rem);\n    line-height: 1.56;\n    letter-spacing: -.025em;\n  }\n\n  .portfolio-panel .contact-copy-line,\n  .portfolio-panel .closing-copy-line {\n    display: block;\n    width: fit-content;\n    max-width: 100%;\n    margin-inline: auto;\n    white-space: nowrap;\n  }\n\n  .portfolio-panel .closing-note h2 {\n'''
assert mobile_marker in visual
visual = visual.replace(mobile_marker, mobile_addition, 1)

old_closing_primary_mobile = '''  .portfolio-panel .closing-message .closing-message-primary {\n    max-width: 34ch;\n    font-size: clamp(.88rem, 3.65vw, .94rem);\n    line-height: 1.75;\n  }\n\n  .portfolio-panel .closing-message .closing-message-secondary {\n    max-width: 35ch;\n    font-size: clamp(.82rem, 3.42vw, .89rem);\n    line-height: 1.78;\n  }\n'''
new_closing_primary_mobile = '''  .portfolio-panel .closing-message .closing-message-primary {\n    width: calc(100% + 16px);\n    max-width: calc(100vw - 20px);\n    font-size: clamp(.74rem, 3.15vw, .86rem);\n    line-height: 1.60;\n    letter-spacing: -.024em;\n  }\n\n  .portfolio-panel .closing-message .closing-message-secondary {\n    width: calc(100% + 16px);\n    max-width: calc(100vw - 20px);\n    font-size: clamp(.73rem, 3.08vw, .84rem);\n    line-height: 1.64;\n    letter-spacing: -.022em;\n  }\n'''
assert old_closing_primary_mobile in visual
visual = visual.replace(old_closing_primary_mobile, new_closing_primary_mobile, 1)

visual = visual.replace('Shared Visual System 1.5.11', 'Shared Visual System 1.5.12', 1)
index = index.replace('visual-system.css?v=1.5.11', 'visual-system.css?v=1.5.12', 1)

assert 'contact-copy-line' in index and 'closing-copy-line' in index
assert 'max-width: calc(100vw - 20px);' in visual
assert 'Shared Visual System 1.5.12' in visual
assert 'visual-system.css?v=1.5.12' in index

index_path.write_text(index, encoding='utf-8')
visual_path.write_text(visual, encoding='utf-8')
