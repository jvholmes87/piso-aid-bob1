"""Rebuild the portable HTML and source archive with Python 3 (standard library only)."""
from pathlib import Path
import hashlib
import base64
import zipfile

root = Path(__file__).resolve().parent
html = (root / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="assets/style.css">', '<style>' + (root / 'assets/style.css').read_text() + '</style>')
html = html.replace('<script src="assets/app.js"></script>', '<script>' + (root / 'assets/app.js').read_text() + '</script>')
for asset in ['hdes-logo.png', 'assembly-reference.png']:
    uri = 'data:image/png;base64,' + base64.b64encode((root / 'assets' / asset).read_bytes()).decode('ascii')
    html = html.replace('src="assets/' + asset + '"', 'src="' + uri + '"')
(root / 'BOB1_Visual_Explorer_v0.3.html').write_text(html)
files = sorted(p for p in root.rglob('*') if p.is_file() and p.suffix != '.zip' and p.name != 'SHA256SUMS.txt' and '__pycache__' not in p.parts)
(root / 'SHA256SUMS.txt').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.relative_to(root).as_posix() + '\n' for p in files))
with zipfile.ZipFile(root / 'BOB1_Visual_Explorer_v0.3.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for p in files + [root / 'SHA256SUMS.txt']:
        archive.write(p, '09_Visual_Explorer/' + p.relative_to(root).as_posix())
print('Built portable HTML and source ZIP.')
