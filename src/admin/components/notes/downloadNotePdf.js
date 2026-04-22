import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function sanitizeFilename(title) {
  const base = String(title || 'shenim')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 72);
  return base || 'shenim';
}

/**
 * Renders note HTML to PDF (multi-page when content is tall).
 */
export async function downloadNoteAsPdf(title, sanitizedHtmlBody) {
  const wrap = document.createElement('div');
  wrap.style.cssText =
    'box-sizing:border-box;width:720px;padding:40px 48px;background:#ffffff;color:#0f172a;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.55;';
  const h = document.createElement('h1');
  h.style.cssText =
    'font-size:22px;font-weight:700;margin:0 0 20px;padding-bottom:14px;border-bottom:1px solid #e2e8f0;line-height:1.25;';
  h.textContent = title || 'Shënim';
  const body = document.createElement('div');
  body.className = 'note-pdf-export';
  body.innerHTML = sanitizedHtmlBody && sanitizedHtmlBody.trim() ? sanitizedHtmlBody : '<p></p>';
  wrap.appendChild(h);
  wrap.appendChild(body);
  document.body.appendChild(wrap);

  try {
    const canvas = await html2canvas(wrap, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: wrap.scrollWidth,
    });

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const usableW = pageW - 2 * margin;
    const usableH = pageH - 2 * margin;

    const fullImgW = usableW;
    const fullImgH = (canvas.height * fullImgW) / canvas.width;

    if (fullImgH <= usableH) {
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', margin, margin, fullImgW, fullImgH);
    } else {
      const sliceHeightPx = (usableH / fullImgH) * canvas.height;
      let sy = 0;
      let first = true;
      while (sy < canvas.height - 0.5) {
        if (!first) pdf.addPage();
        first = false;
        const sliceH = Math.min(sliceHeightPx, canvas.height - sy);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;
        const ctx = sliceCanvas.getContext('2d');
        if (!ctx) break;
        ctx.drawImage(canvas, 0, sy, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        const sliceMmH = (sliceH * usableW) / canvas.width;
        pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.9), 'JPEG', margin, margin, usableW, sliceMmH);
        sy += sliceH;
      }
    }

    pdf.save(`${sanitizeFilename(title)}.pdf`);
  } finally {
    document.body.removeChild(wrap);
  }
}
