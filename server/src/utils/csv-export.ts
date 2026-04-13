/**
 * Generate CSV content from quote request items.
 * Using CSV instead of XLSX to avoid heavy dependencies in Workers environment.
 * CSV can be opened in Excel perfectly fine.
 */

interface QuoteItem {
  product_id: number;
  product_name: string;
  qty: number;
  category?: string;
  specs?: string;
}

interface QuoteExportData {
  id: number;
  customer_name: string;
  email?: string | null;
  phone: string;
  company?: string | null;
  items: QuoteItem[];
  note?: string | null;
  created_at: string;
}

/**
 * Generate a CSV string for attachment (Excel-compatible with BOM for Vietnamese).
 */
export function generateQuoteCSV(data: QuoteExportData): string {
  // BOM for UTF-8 Excel compatibility
  const BOM = "\uFEFF";

  const lines: string[] = [];

  // Header info
  lines.push("YÊU CẦU BÁO GIÁ - SONG LINH TECHNOLOGIES");
  lines.push(`Mã yêu cầu:,#${data.id}`);
  lines.push(`Ngày gửi:,${formatDate(data.created_at)}`);
  lines.push("");
  lines.push("THÔNG TIN KHÁCH HÀNG");
  lines.push(`Họ tên:,${csvEscape(data.customer_name)}`);
  if (data.company) lines.push(`Công ty:,${csvEscape(data.company)}`);
  lines.push(`Số điện thoại:,${csvEscape(data.phone)}`);
  if (data.email) lines.push(`Email:,${csvEscape(data.email)}`);
  if (data.note) lines.push(`Ghi chú:,${csvEscape(data.note)}`);
  lines.push("");

  // Product table
  lines.push("DANH SÁCH SẢN PHẨM");
  lines.push("STT,Tên sản phẩm,Số lượng,Ghi chú");

  data.items.forEach((item, index) => {
    lines.push(
      `${index + 1},${csvEscape(item.product_name)},${item.qty},`,
    );
  });

  lines.push("");
  lines.push(`Tổng số sản phẩm:,${data.items.reduce((sum, i) => sum + i.qty, 0)}`);
  lines.push("");
  lines.push("---");
  lines.push("File này được tạo tự động từ website Song Linh Technologies");

  return BOM + lines.join("\r\n");
}

/** Escape CSV value — wrap in quotes if contains comma, quote, or newline */
function csvEscape(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Format ISO date to Vietnamese format */
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  } catch {
    return iso;
  }
}
