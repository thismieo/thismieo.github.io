from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


index_path = Path("index.html")
styles_path = Path("styles.css")
index = index_path.read_text(encoding="utf-8")
styles = styles_path.read_text(encoding="utf-8")

old_intro = '          <p class="about-lead"><strong>Mohammed Muayad</strong> — an AI Engineering student based in Baghdad, Iraq, currently pursuing a Diploma in Artificial Intelligence Engineering at CIS College. Alongside my work in the private sector, I’m developing a practical foundation in Python, algorithms, machine learning, and modern AI technologies.</p>'
new_intro = '''          <p class="about-lead">
            <span class="about-lead-line about-lead-line-intro"><strong>Mohammed Muayad</strong> — an AI Engineering student based in Baghdad, Iraq</span>
            <span class="about-lead-line about-lead-line-study">currently pursuing a Diploma in Artificial Intelligence Engineering at CIS College</span>
            <span class="about-lead-line about-lead-line-growth">Alongside my work in the private sector, I’m developing a practical foundation in Python, algorithms, machine learning, and modern AI technologies.</span>
          </p>'''
index = replace_once(index, old_intro, new_intro, "About intro markup")

old_about_css = '''.about-content { width: 100%; max-width: 980px; margin-inline: auto; }

.about-lead {
  margin: 0;
  color: #dbe4e7;
  font-size: clamp(1.03rem, 1.45vw, 1.2rem);
  line-height: 1.9;
  max-width: 850px;
  margin-inline: auto;
  text-align: center;
}
'''
new_about_css = '''.about-content { width: 100%; max-width: 1120px; margin-inline: auto; }

.about-lead {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: #dbe4e7;
  text-align: center;
}

.about-lead-line {
  display: block;
  max-width: 100%;
  margin-inline: auto;
  text-align: center;
  text-wrap: balance;
}

.about-lead-line-intro {
  color: #e0e8ea;
  font-size: clamp(1.03rem, 1.34vw, 1.16rem);
  font-weight: 540;
  letter-spacing: -0.018em;
  line-height: 1.7;
}

.about-lead-line-intro strong {
  color: #f0f4f5;
  font-weight: 760;
}

.about-lead-line-study {
  color: #c3d0d5;
  font-size: clamp(0.98rem, 1.18vw, 1.08rem);
  font-weight: 570;
  letter-spacing: -0.014em;
  line-height: 1.72;
}

.about-lead-line-growth {
  max-width: 1000px;
  margin-top: 4px;
  color: #aebdc3;
  font-size: clamp(0.92rem, 1.02vw, 0.99rem);
  font-weight: 470;
  letter-spacing: -0.008em;
  line-height: 1.82;
}
'''
styles = replace_once(styles, old_about_css, new_about_css, "About intro desktop styles")

old_tablet = '''  .about-grid { gap: 30px; }
  .about-content { max-width: 980px; }
  .facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }'''
new_tablet = '''  .about-grid { gap: 30px; }
  .about-content { max-width: 760px; }
  .about-lead { max-width: 720px; gap: 9px; }
  .about-lead-line-intro,
  .about-lead-line-study,
  .about-lead-line-growth {
    max-width: 680px;
  }
  .facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }'''
styles = replace_once(styles, old_tablet, new_tablet, "About intro tablet styles")

mobile_anchor = '''  .facts { grid-template-columns: 1fr; gap: 11px; }
  .facts > div:nth-child(n) { grid-column: auto; }'''
mobile_rules = '''  .about-content { max-width: 100%; }
  .about-lead {
    max-width: 100%;
    gap: 10px;
    padding-inline: 2px;
  }
  .about-lead-line {
    max-width: 34rem;
    white-space: normal;
    overflow-wrap: normal;
    word-break: normal;
  }
  .about-lead-line-intro {
    font-size: clamp(0.94rem, 4vw, 1.02rem);
    line-height: 1.68;
  }
  .about-lead-line-study {
    max-width: 31rem;
    font-size: clamp(0.9rem, 3.78vw, 0.98rem);
    line-height: 1.72;
  }
  .about-lead-line-growth {
    max-width: 33rem;
    margin-top: 3px;
    font-size: clamp(0.84rem, 3.5vw, 0.92rem);
    line-height: 1.78;
  }

  .facts { grid-template-columns: 1fr; gap: 11px; }
  .facts > div:nth-child(n) { grid-column: auto; }'''
styles = replace_once(styles, mobile_anchor, mobile_rules, "About intro mobile styles")

# Keep the first two requested lines intact only on genuinely wide layouts.
wide_anchor = '''@media (min-width: 960px) {
  .hero-tagline { white-space: nowrap; }
}'''
wide_rules = '''@media (min-width: 960px) {
  .hero-tagline { white-space: nowrap; }

  .about-lead-line-intro,
  .about-lead-line-study {
    white-space: nowrap;
  }
}'''
styles = replace_once(styles, wide_anchor, wide_rules, "About intro wide-screen lines")

if index.count("about-lead-line-intro") != 1:
    raise SystemExit("About intro markup validation failed")
if styles.count(".about-lead-line-intro") < 3:
    raise SystemExit("About intro CSS validation failed")
if styles.count("{") != styles.count("}"):
    raise SystemExit("CSS brace balance validation failed")

index_path.write_text(index, encoding="utf-8")
styles_path.write_text(styles, encoding="utf-8")
print("About intro refined successfully.")
