from pathlib import Path

# Diagnostic phase: keep production script.js untouched while we isolate the
# mobile WebKit root-scroller behavior. This patch intentionally performs no
# production mutation and is removed by the successful publish workflow.
Path('script.js').read_text(encoding='utf-8')
Path('index.html').read_text(encoding='utf-8')
