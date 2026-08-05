from pathlib import Path

html_path = Path("index.html")
html = html_path.read_text(encoding="utf-8")

snippet = """  <!-- Cloudflare Web Analytics -->
  <script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "0e7c8d82c34e4ff99c367a980b7d5667"}'></script>
  <!-- End Cloudflare Web Analytics -->
"""

if "0e7c8d82c34e4ff99c367a980b7d5667" not in html:
    if "</body>" not in html:
        raise RuntimeError("Missing closing body tag")
    html = html.replace("</body>", snippet + "</body>", 1)

html = html.replace(
    '<p class="footer-version">Version 4.2.8</p>',
    '<p class="footer-version">Version 4.2.9</p>',
    1,
)

if html.count("0e7c8d82c34e4ff99c367a980b7d5667") != 1:
    raise RuntimeError("Cloudflare analytics token must appear exactly once")
if "Version 4.2.9" not in html:
    raise RuntimeError("Version bump was not applied")
if html.find("0e7c8d82c34e4ff99c367a980b7d5667") > html.find("</body>"):
    raise RuntimeError("Analytics snippet is not before closing body tag")

html_path.write_text(html, encoding="utf-8")
print("cloudflare_analytics=installed")
