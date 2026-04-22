function escapeHtml(text) {
  const s = String(text ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeFilename(title) {
  const base = String(title || 'shënim')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 72);
  return base || 'shenim';
}

/**
 * Download note as a standalone .html file (opens in Word or browser).
 */
export function downloadNoteAsHtml(title, bodyHtml) {
  const safeTitle = escapeHtml(title || 'Shënim');
  const inner = bodyHtml && bodyHtml.trim() ? bodyHtml : '<p></p>';
  const doc = `<!DOCTYPE html>
<html lang="sq">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(title || 'Shënim')}</title>
<style>
  body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 48rem; margin: 2rem auto; padding: 0 1.25rem; color: #0f172a; }
  h1.doc-title { font-size: 1.75rem; font-weight: 700; margin: 0 0 1.25rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem; }
  .content { font-size: 1rem; }
  .content h1 { font-size: 1.5rem; margin: 1rem 0 0.5rem; }
  .content h2 { font-size: 1.25rem; margin: 0.85rem 0 0.4rem; }
  .content h3 { font-size: 1.1rem; margin: 0.65rem 0 0.35rem; }
  .content p { margin: 0.4rem 0; }
  .content ul, .content ol { margin: 0.4rem 0; padding-left: 1.35rem; }
  .content blockquote { margin: 0.5rem 0; padding-left: 0.85rem; border-left: 3px solid #cbd5e1; color: #475569; }
</style>
</head>
<body>
  <h1 class="doc-title">${safeTitle}</h1>
  <div class="content">${inner}</div>
</body>
</html>`;
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(title)}.html`;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
