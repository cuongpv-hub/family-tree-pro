# Kế Hoạch Lập Trình Thượng Cấp: Xây Dựng Máy Chủ Trạm (Backend REST API)

Việc chuyển Mảng Dữ Liệu Tạm Thời Thành một "Trạm Máy Chủ Trung Ương" độc lập (Backend) là bước tiến từ Đồ Chơi (Demo) Lên Trở Thành Một Phần Mềm Siêu Cấp Thực Sự. 

## 1. Kiến Trúc Vận Hành
Hệ thống được thiết kế Đa Phân Rã (Micro-environment): 
- **Frontend App**: Chạy Port `5173`. Chuyên xử lý Đồ Họa Cây đệ quy và Giao diện thẩm mỹ.
- **Backend App**: Chạy Port `5000`. Chuyên làm trạm gác đóng mở Cửa CSDL.

## 2. Chi Tiết Thực Thi
### Khởi Tạo Vùng Đất Mới (Project Workspace mới)
- Thư mục Cấu trúc: `d:\Project\family-tree-backend`.
- **Ngôn Nữ/Nền Tảng**: Sử dụng **Node.js + Express.js**. Lõi công nghệ nhanh, tương thích cực kỳ khớp lệnh với React (MERN Stack thu gọn).

### Lõi Động Cơ Cơ Sở Dữ Liệu (Database Kernel)
- Ở giai đoạn Chạy nội bộ làm gốc, thay vì cài Oracle hay MySQL cực kì phiền toái, Dự án Cắm Mốc dùng **SQLite + Sequelize**. 
- SQLite nén toàn bộ Data thành 1 Tệp Thể Rắn ngay trong Folder (`family_tree.sqlite`), tốc độ truy xuất không độ trễ. 

### Cấu Thiết Thư Mục Backend 
- `server.js`: Trạm thu sóng, gác cổng mở Port 5000 để mở REST API.
- `routes/`: Nơi chia rẽ đường mạng.
  - `routes/userRoutes.js`: Sinh API `/api/users/login` cấp Quyền Đăng Nhập.
  - `routes/memberRoutes.js`: Sinh API GET, POST, PUT, DELETE cho `/api/members`.
- `models/`: Định nghĩa Phom xương Hộp Sọ cho Data.
  - `Member.js`: Định hình Thẻ Căn cước, Sinh-Tử, Tọa độ kết nối cây `parentId`.
  - `User.js`: Cầm cân Nút đăng nhập Trị Sự (Role Admin vs User).

## 3. Quy Trình Vận Hành Mạng Lưới Xóa Rác Đệ Quy
Hệ thống sử dụng kỹ thuật **Cascade Delete Nâng cao (Logic Cục Bộ + Giao Mạng)**:
1. Khi có Mệnh lệnh "Tử Hình" (Xóa) một Gốc cây trên Đồ họa.
2. React gọi truy vấn đệ quy vòng lặp Đếm Số Toàn Bộ Rễ cây Con Cháu mọc ra từ cái Gốc đó. Gom chúng thành 1 mảng.
3. Ra lệnh nã súng liên thanh Đại bác REST API (`DELETE /api/members/:id`) tàn sát 1 lúc toàn bộ Gốc Rễ trong SQLite để giữ Database phẳng, sạch bong.

*Tài liệu này được trích xuất từ Quá Trình Làm Việc Thực Tế với Hệ thống Antigravity AI.*
