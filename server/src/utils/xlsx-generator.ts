/**
 * Lightweight XLSX generator for Cloudflare Workers.
 * 
 * Generates Office Open XML (.xlsx) files without heavy libraries like ExcelJS.
 * Uses raw XML + ZIP (via JSZip-like approach with built-in compression).
 * 
 * Why not ExcelJS? Workers has 1MB bundle limit; ExcelJS is ~2MB.
 * This approach generates valid XLSX files under 50KB with Song Linh Technologies branding.
 */

interface XlsxQuotationData {
  id: number;
  customer_name: string;
  company_name: string | null;
  email: string | null;
  phone: string;
  project_name: string | null;
  note: string | null;
  created_at: string;
  items: Array<{
    product_name: string;
    product_image?: string | null;
    category_name?: string | null;
    quantity: number;
    notes?: string | null;
  }>;
}

/**
 * Generate a professional XLSX file for an RFQ quotation.
 * Returns an ArrayBuffer (ready for R2 upload or email attachment).
 */
export async function generateQuotationXlsx(
  data: XlsxQuotationData,
): Promise<ArrayBuffer> {
  const dateStr = formatDateVN(data.created_at);
  const fileName = `SLTECH_RFQ_${data.id}`;

  // ── Build sheet rows ──
  const rows: SheetRow[] = [];

  // Header section
  rows.push({ cells: [{ v: "SONG LINH TECHNOLOGY CO., LTD", s: "title" }] });
  rows.push({ cells: [{ v: "Hệ thống tích hợp ELV & ICT", s: "subtitle" }] });
  rows.push({ cells: [] }); // empty row

  rows.push({ cells: [{ v: `PHIẾU YÊU CẦU BÁO GIÁ — Mã: ${fileName}`, s: "heading" }] });
  rows.push({ cells: [{ v: `Ngày: ${dateStr}`, s: "normal" }] });
  rows.push({ cells: [] });

  // Customer info section
  rows.push({ cells: [{ v: "THÔNG TIN KHÁCH HÀNG", s: "section" }] });
  rows.push({ cells: [{ v: "Họ tên:", s: "label" }, { v: data.customer_name, s: "value" }] });
  if (data.company_name) {
    rows.push({ cells: [{ v: "Công ty:", s: "label" }, { v: data.company_name, s: "value" }] });
  }
  rows.push({ cells: [{ v: "SĐT:", s: "label" }, { v: data.phone, s: "value" }] });
  if (data.email) {
    rows.push({ cells: [{ v: "Email:", s: "label" }, { v: data.email, s: "value" }] });
  }
  if (data.project_name) {
    rows.push({ cells: [{ v: "Dự án:", s: "label" }, { v: data.project_name, s: "value" }] });
  }
  rows.push({ cells: [] });

  // Product table
  rows.push({ cells: [{ v: "DANH SÁCH SẢN PHẨM", s: "section" }] });
  rows.push({
    cells: [
      { v: "STT", s: "header" },
      { v: "Sản phẩm", s: "header" },
      { v: "Danh mục", s: "header" },
      { v: "Số lượng", s: "header" },
      { v: "Đơn giá", s: "header" },
      { v: "Thành tiền", s: "header" },
      { v: "Ghi chú", s: "header" },
    ],
  });

  let totalQty = 0;
  data.items.forEach((item, i) => {
    totalQty += item.quantity;
    rows.push({
      cells: [
        { v: String(i + 1), s: "normal" },
        { v: item.product_name, s: "normal" },
        { v: item.category_name ?? "—", s: "normal" },
        { v: String(item.quantity), s: "number" },
        { v: "", s: "normal" }, // empty - for admin to fill
        { v: "", s: "normal" }, // empty - for admin to fill
        { v: item.notes ?? "", s: "normal" },
      ],
    });
  });

  // Total row
  rows.push({
    cells: [
      { v: "", s: "normal" },
      { v: "", s: "normal" },
      { v: "Tổng cộng:", s: "label" },
      { v: String(totalQty), s: "number" },
      { v: "", s: "normal" },
      { v: "", s: "normal" },
      { v: "", s: "normal" },
    ],
  });

  rows.push({ cells: [] });

  // Notes
  if (data.note) {
    rows.push({ cells: [{ v: `Ghi chú: ${data.note}`, s: "normal" }] });
    rows.push({ cells: [] });
  }

  // Footer
  rows.push({ cells: [{ v: "────────────────────────────────────────────", s: "normal" }] });
  rows.push({ cells: [{ v: "Song Linh Technologies — songlinh@sltech.vn — sltech.vn", s: "subtitle" }] });
  rows.push({ cells: [{ v: "File này được tạo tự động từ website Song Linh Technologies", s: "normal" }] });

  return buildXlsx(rows, fileName);
}

// ═══════════════════════════════════════════════
// XLSX Builder — raw Office Open XML
// ═══════════════════════════════════════════════

interface CellData {
  v: string;
  s: "title" | "subtitle" | "heading" | "section" | "header" | "label" | "value" | "normal" | "number";
}

interface SheetRow {
  cells: CellData[];
}

/**
 * Build a minimal valid XLSX file from rows.
 * XLSX = ZIP of XML files following Office Open XML standard.
 */
async function buildXlsx(rows: SheetRow[], _sheetName: string): Promise<ArrayBuffer> {
  // Column widths (approximate characters)
  const colWidths = [6, 40, 15, 10, 15, 15, 20];

  // Build shared strings
  const sharedStrings = new Map<string, number>();
  const ssList: string[] = [];

  function getSSIndex(str: string): number {
    if (sharedStrings.has(str)) return sharedStrings.get(str)!;
    const idx = ssList.length;
    ssList.push(str);
    sharedStrings.set(str, idx);
    return idx;
  }

  // Pre-process all cell values into shared strings
  for (const row of rows) {
    for (const cell of row.cells) {
      if (cell.v) getSSIndex(cell.v);
    }
  }

  // Build sheet XML
  const sheetXml = buildSheetXml(rows, colWidths, sharedStrings);
  const ssXml = buildSharedStringsXml(ssList);
  const stylesXml = buildStylesXml();

  // Assemble ZIP
  const files: Record<string, string> = {
    "[Content_Types].xml": contentTypesXml(),
    "_rels/.rels": relsXml(),
    "xl/_rels/workbook.xml.rels": workbookRelsXml(),
    "xl/workbook.xml": workbookXml(),
    "xl/styles.xml": stylesXml,
    "xl/sharedStrings.xml": ssXml,
    "xl/worksheets/sheet1.xml": sheetXml,
  };

  return createZipBuffer(files);
}

function buildSheetXml(
  rows: SheetRow[],
  colWidths: number[],
  ss: Map<string, number>,
): string {
  const colsXml = colWidths
    .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
    .join("");

  let rowsXml = "";
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    let cellsXml = "";
    for (let c = 0; c < row.cells.length; c++) {
      const cell = row.cells[c];
      if (!cell.v) {
        cellsXml += `<c r="${colRef(c)}${r + 1}" s="${getStyleIndex(cell.s)}"/>`;
        continue;
      }
      const ssIdx = ss.get(cell.v);
      if (ssIdx !== undefined) {
        cellsXml += `<c r="${colRef(c)}${r + 1}" t="s" s="${getStyleIndex(cell.s)}"><v>${ssIdx}</v></c>`;
      }
    }
    // Set row height for title/heading rows
    const ht = row.cells[0]?.s === "title" ? 28 : row.cells[0]?.s === "heading" ? 24 : 18;
    rowsXml += `<row r="${r + 1}" ht="${ht}" customHeight="1">${cellsXml}</row>`;
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<cols>${colsXml}</cols>
<sheetData>${rowsXml}</sheetData>
</worksheet>`;
}

function buildSharedStringsXml(strings: string[]): string {
  const items = strings
    .map((s) => `<si><t>${escapeXml(s)}</t></si>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">
${items}
</sst>`;
}

function buildStylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="6">
  <font><sz val="11"/><name val="Calibri"/></font>
  <font><b/><sz val="16"/><color rgb="FF1E3A5F"/><name val="Calibri"/></font>
  <font><sz val="11"/><color rgb="FF64748B"/><name val="Calibri"/></font>
  <font><b/><sz val="14"/><color rgb="FF1E3A5F"/><name val="Calibri"/></font>
  <font><b/><sz val="12"/><color rgb="FF334155"/><name val="Calibri"/></font>
  <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
</fonts>
<fills count="4">
  <fill><patternFill patternType="none"/></fill>
  <fill><patternFill patternType="gray125"/></fill>
  <fill><patternFill patternType="solid"><fgColor rgb="FF1E3A5F"/></patternFill></fill>
  <fill><patternFill patternType="solid"><fgColor rgb="FFF1F5F9"/></patternFill></fill>
</fills>
<borders count="2">
  <border><left/><right/><top/><bottom/><diagonal/></border>
  <border>
    <left style="thin"><color rgb="FFE2E8F0"/></left>
    <right style="thin"><color rgb="FFE2E8F0"/></right>
    <top style="thin"><color rgb="FFE2E8F0"/></top>
    <bottom style="thin"><color rgb="FFE2E8F0"/></bottom>
    <diagonal/>
  </border>
</borders>
<cellStyleXfs count="1">
  <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
</cellStyleXfs>
<cellXfs count="8">
  <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  <xf numFmtId="0" fontId="1" fillId="0" borderId="0"/>
  <xf numFmtId="0" fontId="2" fillId="0" borderId="0"/>
  <xf numFmtId="0" fontId="3" fillId="0" borderId="0"/>
  <xf numFmtId="0" fontId="4" fillId="3" borderId="1"/>
  <xf numFmtId="0" fontId="5" fillId="2" borderId="1" applyAlignment="1"><alignment horizontal="center"/></xf>
  <xf numFmtId="0" fontId="0" fillId="0" borderId="1"/>
  <xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyAlignment="1"><alignment horizontal="center"/></xf>
</cellXfs>
</styleSheet>`;
}

function getStyleIndex(s: CellData["s"]): number {
  switch (s) {
    case "title": return 1;
    case "subtitle": return 2;
    case "heading": return 3;
    case "section": return 4;
    case "header": return 5;
    case "label": return 6;
    case "value": return 6;
    case "number": return 7;
    case "normal":
    default: return 0;
  }
}

function colRef(idx: number): string {
  return String.fromCharCode(65 + idx); // A-Z (up to 26 columns)
}

// ═══════════════════════════════════════════════
// Office Open XML package structure
// ═══════════════════════════════════════════════

function contentTypesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`;
}

function relsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
}

function workbookXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Báo giá" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;
}

function workbookRelsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;
}

// ═══════════════════════════════════════════════
// ZIP builder — minimal implementation
// Uses the STORE method (no compression),
// which is fine for XML text and keeps it simple.
// ═══════════════════════════════════════════════

async function createZipBuffer(files: Record<string, string>): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const entries: Array<{
    name: Uint8Array;
    data: Uint8Array;
    crc: number;
    offset: number;
  }> = [];

  const parts: Uint8Array[] = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const dataBytes = encoder.encode(content);
    const crc = crc32(dataBytes);

    entries.push({ name: nameBytes, data: dataBytes, crc, offset });

    // Local file header
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // signature
    lv.setUint16(4, 20, true);         // version needed
    lv.setUint16(6, 0, true);          // flags
    lv.setUint16(8, 0, true);          // compression (STORE)
    lv.setUint16(10, 0, true);         // mod time
    lv.setUint16(12, 0, true);         // mod date
    lv.setUint32(14, crc, true);       // crc32
    lv.setUint32(18, dataBytes.length, true); // compressed size
    lv.setUint32(22, dataBytes.length, true); // uncompressed size
    lv.setUint16(26, nameBytes.length, true); // file name length
    lv.setUint16(28, 0, true);         // extra field length
    localHeader.set(nameBytes, 30);

    parts.push(localHeader);
    parts.push(dataBytes);
    offset += localHeader.length + dataBytes.length;
  }

  // Central directory
  const centralStart = offset;
  for (const entry of entries) {
    const cdHeader = new Uint8Array(46 + entry.name.length);
    const cv = new DataView(cdHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // signature
    cv.setUint16(4, 20, true);         // version made by
    cv.setUint16(6, 20, true);         // version needed
    cv.setUint16(8, 0, true);          // flags
    cv.setUint16(10, 0, true);         // compression
    cv.setUint16(12, 0, true);         // mod time
    cv.setUint16(14, 0, true);         // mod date
    cv.setUint32(16, entry.crc, true); // crc32
    cv.setUint32(20, entry.data.length, true); // compressed
    cv.setUint32(24, entry.data.length, true); // uncompressed
    cv.setUint16(28, entry.name.length, true); // name length
    cv.setUint16(30, 0, true);         // extra length
    cv.setUint16(32, 0, true);         // comment length
    cv.setUint16(34, 0, true);         // disk start
    cv.setUint16(36, 0, true);         // internal attrs
    cv.setUint32(38, 0, true);         // external attrs
    cv.setUint32(42, entry.offset, true); // relative offset
    cdHeader.set(entry.name, 46);
    parts.push(cdHeader);
    offset += cdHeader.length;
  }

  const centralSize = offset - centralStart;

  // End of central directory
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // signature
  ev.setUint16(4, 0, true);          // disk number
  ev.setUint16(6, 0, true);          // disk with CD
  ev.setUint16(8, entries.length, true);  // entries on disk
  ev.setUint16(10, entries.length, true); // total entries
  ev.setUint32(12, centralSize, true);    // CD size
  ev.setUint32(16, centralStart, true);   // CD offset
  ev.setUint16(20, 0, true);             // comment length
  parts.push(eocd);

  // Concatenate all parts
  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const part of parts) {
    result.set(part, pos);
    pos += part.length;
  }

  return result.buffer;
}

// ═══════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDateVN(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

/** Generate XLSX filename: SLTECH_RFQ_[ID]_[YYYYMMDD].xlsx */
export function getXlsxFileName(id: number, createdAt: string): string {
  let dateStr: string;
  try {
    const d = new Date(createdAt);
    dateStr = `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, "0")}${d.getDate().toString().padStart(2, "0")}`;
  } catch {
    dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  }
  return `SLTECH_RFQ_${id}_${dateStr}.xlsx`;
}

// CRC-32 (ISO 3309 / ITU-T V.42)
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Re-export for use in other modules
export type { XlsxQuotationData };
