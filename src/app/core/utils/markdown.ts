/**
 * Minimal, safe Markdown -> HTML for LLM answers: paragraphs, bullet lists, tables,
 * **bold**, *italic* and `code`. Everything is HTML-escaped first, so the result can be
 * bound to [innerHTML] (Angular sanitizes it again).
 */
const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (text: string): string =>
  escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');

const cells = (row: string): string[] =>
  row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());

const isTableSeparator = (line: string): boolean =>
  /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);

const BULLET = /^\s*[-*•]\s+/;

export function renderMarkdown(source: string): string {
  const lines = (source ?? '').replace(/\r\n/g, '\n').split('\n');
  const startsTable = (i: number): boolean =>
    lines[i].includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1]);
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // Table: header row followed by a separator row.
    if (startsTable(i)) {
      const head = cells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) { rows.push(cells(lines[i])); i++; }
      out.push(
        '<table class="md-table"><thead><tr>' + head.map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>' +
        rows.map(r => '<tr>' + r.map(c => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table>',
      );
      continue;
    }

    // Bullet list
    if (BULLET.test(line)) {
      const items: string[] = [];
      while (i < lines.length && BULLET.test(lines[i])) { items.push(lines[i].replace(BULLET, '')); i++; }
      out.push('<ul>' + items.map(t => `<li>${inline(t)}</li>`).join('') + '</ul>');
      continue;
    }

    // Paragraph: consecutive plain lines, kept as line breaks.
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !BULLET.test(lines[i]) && !startsTable(i)) {
      para.push(inline(lines[i]));
      i++;
    }
    out.push(`<p>${para.join('<br>')}</p>`);
  }
  return out.join('');
}
