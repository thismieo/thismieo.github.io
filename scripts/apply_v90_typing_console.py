#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS = ROOT / "learning-console-v90.css"

text = CSS.read_text(encoding="utf-8")
old = '''#home .hero-console-v90-message:nth-child(1) {
  animation: heroConsoleV90TypeA 15s steps(29, end) 0s infinite both;
}

#home .hero-console-v90-message:nth-child(2) {
  animation: heroConsoleV90TypeB 15s steps(34, end) 5s infinite both;
}

#home .hero-console-v90-message:nth-child(3) {
  animation: heroConsoleV90TypeC 15s steps(22, end) 10s infinite both;
}
'''
new = '''#home .hero-console-v90-message:nth-child(1) {
  animation-name: heroConsoleV90TypeA;
  animation-duration: 15s;
  animation-timing-function: steps(29, end);
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

#home .hero-console-v90-message:nth-child(2) {
  animation-name: heroConsoleV90TypeB;
  animation-duration: 15s;
  animation-timing-function: steps(34, end);
  animation-delay: 5s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

#home .hero-console-v90-message:nth-child(3) {
  animation-name: heroConsoleV90TypeC;
  animation-duration: 15s;
  animation-timing-function: steps(22, end);
  animation-delay: 10s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}
'''
if text.count(old) != 1:
    raise SystemExit(f"Expected one V90 animation block; found {text.count(old)}")
CSS.write_text(text.replace(old, new, 1), encoding="utf-8")
Path(__file__).unlink()
