# Cẩm nang Phục hồi Dữ liệu (Database Disaster Recovery)

> **Mức độ Ưu tiên:** CRITICAL 🚨
> Tệp này hướng dẫn quản trị viên cách phục hồi toàn bộ cơ sở dữ liệu (Cloudflare D1) trong trường hợp hệ thống gặp lỗi nghiêm trọng, bị tấn công hoặc dữ liệu bị hỏng hóc, dựa vào các bản sao lưu (SQL Dump) được xuất tự động hàng tuần vào kho R2.

---

## 🏗️ Kiến trúc sao lưu hiện tại
Hàng tuần (vào lúc 3:00 AM UTC ngày Chủ Nhật), Cloudflare Trigger Cronjob sẽ tự động gọi Cloudflare REST API để trích xuất dữ liệu gốc từ D1 Database. File SQL Dump này định dạng `application/vnd.sqlite3` sẽ được đẩy vào Bucket R2 `songlinh-web` dưới thư mục `backups/`.

Format tên tệp: `backups/sltech_db_YYYY-MM-DD.sqlite`

## 🛠️ Quy trình Khôi phục Thủ công (Manual Restore)

Khi có sự cố xảy ra, hãy thực hiện cẩn thận theo 4 bước sau:

### Bước 1: Tải bản Backup từ R2
1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Chọn menu **R2** > chọn Bucket `songlinh-web`.
3. Nhấp vào thư mục `backups/`.
4. Tìm file backup gần nhất trước thời điểm xảy ra sự cố (Ví dụ: `sltech_db_2026-04-12.sqlite`).
5. Tải file này về máy tính cá nhân (lưu vào thư mục cùng cấp với `server/` hoặc bất cứ đâu dễ tìm).

### Bước 2: Chuẩn bị Môi trường Local (Wrangler)
Mở Terminal/Powershell, đi vào thư mục Backend `server/` của dự án và đảm bảo bạn đã login Cloudflare CLI.
```bash
cd server/
npx wrangler login
```

### Bước 3: Nạp dữ liệu vào Database Production
Sử dụng câu lệnh `d1 execute` của Wrangler để ném cục file SQL đó thẳng vào D1.
Lưu ý: Mặc định tùy chọn SQLite dump của CF sẽ sinh ra các thẻ CREATE/INSERT, việc nạp đè có thể cần dọn dẹp trước nếu tên bảng trùng lặp (trừ khi file có sử dụng REPLACE). Vì vậy, an toàn nhất là chạy lệnh trực tiếp từ file:

```bash
# Phục hồi vào Production:
npx wrangler d1 execute songlinh-db --file=./sltech_db_2026-04-12.sqlite

# Nếu chỉ muốn test phục hồi vào Local trước khi bắn lên Prod:
npx wrangler d1 execute songlinh-db --local --file=./sltech_db_2026-04-12.sqlite
```
*(Thay thế đường dẫn `./sltech_db_....sqlite` bằng đường dẫn thực tế đến file bạn vừa tải)*

### Bước 4: Chạy kiểm chứng
Sau khi Terminal báo `Executed X queries`, hãy mở trình duyệt vào Backend (`https://sltech.vn/api/admin/dashboard/stats`) bằng quyền Admin để xác nhận dữ liệu đã về số lượng chính xác tại thời điểm trước sự cố.

---
**Troubleshooting:**
- Nếu file backup quá lớn (hàng trăm MB), việc chạy lệnh qua Wrangler Console có thể bị timeout. Trong trường hợp đó, bạn cần sử dụng Cloudflare D1 Console trên web Dashboard để import trực tiếp file SQLite.
