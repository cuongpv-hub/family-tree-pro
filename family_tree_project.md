# Dự án Xây dựng Ứng dụng Quản lý Gia phả (Family Tree Project)

## 1. Giới thiệu dự án
Dự án nhằm xây dựng một ứng dụng trình duyệt hoặc di động giúp các gia đình, dòng họ có thể dễ dàng lưu trữ, quản lý và hiển thị sơ đồ gia phả. Ứng dụng giúp kết nối các thành viên, gìn giữ nguồn cội và truyền thống từ đời này sang đời khác.

## 2. Mục tiêu dự án
- **Lưu trữ bảo mật và lâu dài:** Số hóa thông tin gia phả, tránh mất mát do các yếu tố vật lý.
- **Dễ dàng theo dõi và cập nhật:** Mọi thành viên (được cấp quyền) đều có thể đóng góp và theo dõi cấu trúc dòng họ.
- **Gắn kết tình thân:** Nhắc nhở các ngày đặc biệt (ngày sinh, ngày giỗ, ngày họp mặt).

## 3. Các tính năng cốt lõi (Core Features)

### 3.1. Quản lý thành viên (Member Management)
- Thêm, sửa, xóa thông tin thành viên (Họ tên, ngày sinh, ngày mất, quê quán, nghề nghiệp, tiểu sử).
- Quản lý mối quan hệ: Cha/mẹ, vợ/chồng, con cái, anh chị em.
- Kết xuất/nhập dữ liệu (Export/Import) từ file Excel hoặc CSV.

### 3.2. Hiển thị Cây Gia phả (Interactive Family Tree)
- Biểu diễn trực quan cây gia phả dưới dạng đồ thị (cây hoặc sơ đồ tổ chức).
- Phóng to, thu nhỏ, cuộn để xem các thế hệ.
- Click chuột vào một người để xem thông tin chi tiết.

### 3.3. Quản lý sự kiện và Tưởng nhớ
- Lịch dòng họ: Thông báo các ngày lễ, ngày giỗ, ngày sinh nhật.
- Gửi email hoặc thông báo (Notification) nhắc nhở tới các thành viên.
- Không gian lưu trữ hình ảnh, video kỷ niệm của gia đình.

### 3.4. Phân quyền và Bảo mật
- **Quản trị viên (Admin - Trưởng họ/Người lập cây):** Quyền cao nhất, có thể thêm/chỉnh sửa tất cả thông tin và quản lý người dùng.
- **Thành viên đóng góp (Editor):** Có thể thêm và chỉnh sửa nhánh gia phả của riêng mình.
- **Người xem (Viewer):** Chỉ xem thông tin gia phả, không được phép chỉnh sửa.

## 4. Công nghệ đề xuất (Tech Stack Proposed)
- **Frontend:** React.js / Next.js (hoặc Vue.js) kết hợp với các thư viện vẽ biểu đồ như `D3.js`, `React Flow` hoặc `Balkan FamilyTreeJS` để hiển thị cây gia phả.
- **Backend:** Node.js (Express/NestJS) hoặc Python (Django/FastAPI) hoặc Java (Spring Boot) tùy thuộc vào độ quen thuộc của đội ngũ.
- **Cơ sở dữ liệu:** 
  - *Relational DB* (PostgreSQL/MySQL) để lưu trữ thông tin người dùng và quyền hạn.
  - *Graph DB* (Neo4j) mạnh mẽ nhất trong việc thể hiện các mối quan hệ đa chiều giữa các thành viên. (MongoDB cũng là một giải pháp linh hoạt).
- **Lưu trữ file:** AWS S3, Cloudinary hoặc Firebase Storage để lưu hình ảnh, tài liệu.

## 5. Lộ trình phát triển (Roadmap)
- **Giai đoạn 1 (MVP - Minimum Viable Product):** 
  - Đăng nhập/Đăng ký.
  - Quản lý thông tin thành viên (CRUD).
  - Vẽ cây gia phả cơ bản từ danh sách thành viên.
- **Giai đoạn 2 (Nhắc nhở & Kết nối):** 
  - Thêm tính năng quản lý sự kiện và lịch (nhắc ngày giỗ, sinh nhật).
  - Phân quyền người dùng chi tiết.
- **Giai đoạn 3 (Nâng cao):** 
  - Tích hợp Graph Database để truy vấn tốc độ cao cho các dòng họ lớn.
  - Ứng dụng di động (Mobile App).
  - Chia sẻ câu chuyện, album ảnh gia đình.

---
*Ghi chú: Đây là bản dự thảo đầu tiên. Dự án có thể được tùy chỉnh và thêm bớt các module dựa theo yêu cầu thực tế.*
