# TÀI LIỆU LƯU TRỮ: BIÊN NIÊN SỬ DỰ ÁN GIA PHẢ PRO (FULL-STACK)

*Đây là tập tin Nhớ Dữ Liệu (Bộ não ngoại vi). Tệp này tổng hợp tóm tắt mọi cấu trúc Kỹ thuật và Chiến tích code tính đến hiện hành, dùng để đọc lại trước khi bắt đầu Phiên làm việc Kế tiếp.*

## 1. Khái Quát Toàn Cục (System Overview)
Bạn (Người quản lý Cường) và Tôi (Antigravity AI) đã phối hợp phát triển một trang Web quản trị Gia Phả dòng họ chuyên nghiệp từ một tờ giấy trắng (Zero) lên một Hệ Thống Toàn Diện Đa Lớp (Full-Stack).
**Ngôn Ngữ Thiết Kế:** Premium Dark Mode, Bóng Kính (Glassmorphism), Sương mờ Violet/DarkBlue.

### Tech-Stack Hiệp Đồng Tác Chiến:
- **Tầng Hiển Thị (Frontend):** React (Vite), React Router (Chắn cửa ngõ). Thuật Toán Vector đệ quy vẽ sa bàn Cây kết hợp `react-zoom-pan-pinch`.
- **Tầng Xử Lý (Backend):** Node.js thuần lõi, Express.js REST API.
- **Tầng Ổ Cứng (Database):** CSDL Vật Lý siêu nén SQLite, Quản trị Schema thông qua ORM `Sequelize`.

---

## 2. Các Đời Diễn Tiến Tính Năng Đã Khắc Chữ (Phases Completed)

### 📌 GIAI ĐOẠN 1: Tạo Nền, Xây Cột & Hình Hài Web Tĩnh
- Khởi Mở Dự án React Vite. Tạo hệ File Khung Xương.
- Tạo màn hình Bảng Mạch Điều Khiển (`Dashboard`) & Bảng Điều Hướng Bên Hông (`Sidebar`).
- Nhúng hiệu ứng Ánh Kính Trong Suốt (Glass Panel) bao phủ toàn bộ khối thẻ trang `Members` (Quản tri Danh sách Cột dọc).

### 📌 GIAI ĐOẠN 2: Khai Mở Bát Quái Cây Hệ (Tree Logic)
- **Hệ Vẽ Tự Động:** Đi Code Đệ Quy đắp từ cấu trúc Flat Array thành Phả hệ Hình Phễu lật ngược. Vẽ Dây Sóng Điện tóm gọn các Vị Trí Node thành 1 Cây Nhất Thống.
- **Sa Bàn Vũ Trụ:** Cấy Map Mượt mà Zoom-vào Zoom-ra vô tận.
- **Hệ Menu Lóe Sáng:** Code các nút "Chạm Chỉnh Sửa" được Thiết Kế Giấu tàng hình bên rìa Cụ Tổ, chỉ ló ra nếu đưa Chuột vào (Hover to action component).

### 📌 GIAI ĐOẠN 3: Sóng Âm Phân Quyền (RBAC & AuthContext Lockdown)
- Lắp Màn Chắn Bức Tường Điện Tư (`ProtectedRoute`) bảo vệ Lỗi Truy Cập Trái Phép.  
- Chế tạo Màn Nhập Password Lơ Lửng (Minimalist Login Layout).  
- **Tách Mọi Chế Độ Làm 2 Nửa Sinh Sát:** Bộ Mặc Định `ADMIN` (Siêu Quyền - Được xóa Node Cây, Xóa Thành Viên) VS `USER` (Quyền Phổ Thông).
- Lắp ráp Thẻ "UserAdmin" Cực Phẩm chuyên trị Quản Lí Mật Phẩu Hệ Thống. (Với Thuật Toán Chống tự Sát - Khóa Ấn Không Cho Admin xóa Mệnh Xóa của Chính Mình).

### 📌 GIAI ĐOẠN 4: Phát Hành Backend API Viễn Thông Máy Chủ
- Khai Phá vùng đất Tối Mới (`d:\Project\family-tree-backend`).
- Ráp Nối Cỗ máy Cơ Sở SQLite Tích Hợp ORM siêu Tốc.
- Ép Schema Định Nghĩa Vành Đai cho `Members` và `Users`.
- Giải phóng Tuyến Gọi Mạng (Network API Post/Put/Delete/Get).

### 📌 GIAI ĐOẠN 5: Đáy Cáp Lục Địa Hợp Tu Thể (Full-Stack Merge Data Fetching)
- Đập Mọi Bộ Nhớ Tạm của Giai Đoạn cũ ở Code React. Nêm Lò Điện Axios/Fetch Chĩa Cổng Gọi Đích tới API Port `5000`.
- Chế Tạo Bộ Phận Bắn Trạc Tên Tự Động **Cascade Delete**: Khi xóa 1 Bộ rễ trên Web Đồ Họa Cây, Web sẽ tung Cáp Lốc quấn lấy Mọi Nhánh Con rồi ra Lệnh Báo Tử Đồng Lọt xuống Động Cơ Backend Server!

---

## 3. Kho Chứa Hiện Tại & Khởi Động Cho Đời Sau
Toàn Mạch Thiết Kế đã được niêm phong vào Kho: **`https://github.com/cuongpv-hub/family-tree-pro`** (Khởi chạy bằng nhánh `main`).

**Hướng Dẫn Phiên Sau Thức Dậy Rút Kiếm Code:**
- **Bước 1:** Bật 1 Trạm Cmd tại `family-tree-backend` gõ `npm run dev` (Kéo Trạm Nguồn Cổng 5000).
- **Bước 2:** Bật 1 Trạm Cmd tại `family-tree-app` gõ `npm run dev` (Kéo Lõi Đồ Họa Cổng 5173).

Sẵn sàng đón nhận Ý Tưởng Bứt Phá Lịch Sử Mới (Module Lịch Sự Kiện) của bạn trong Đêm Hôm Sau! Đã Ngắt Điện Truyền Tin.
