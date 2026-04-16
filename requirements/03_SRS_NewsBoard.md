# Kế Hoạch Lập Trình: Bảng Tin Dòng Họ & Bài Luận (News Board Module)

Thấu hiểu nhu cầu của dòng họ không chỉ cần cây gia phả khô khan mà còn cần **Gìn giữ Ký ức bằng những câu chuyện**. Đây là công cụ tuyệt vời để Trưởng họ đăng Bài Lịch sử dòng họ, hoặc các thành viên kể lại kỷ niệm các dịp họp mặt.

## 1. Mục tiêu (Mô hình Dữ Liệu Bài Viết)
Xây dựng một tính năng **"Tin Tức & Ký Sự" (News Board)** mới hoàn toàn với các phân loại (Category) trực quan.

## 2. Chi tiết thực thi 

### Backend (Express + SQLite)
Tôi sẽ tạo ra một bộ Cấu trúc API mới độc lập:

#### [NEW] [models/Post.js]
Tạo Model lưu trữ Bài viết với các trường: `id`, `title`, `content` (TEXT), `category`, `author`.

#### [NEW] [models/Comment.js]
Tạo Model lưu trữ Bình luận cho bài viết:
- `id`: Mã định danh.
- `postId`: ID của bài viết (Liên kết tới bảng Post).
- `author`: Tên người bình luận (User đang đăng nhập).
- `content`: Nội dung bình luận.

#### [NEW] [routes/postRoutes.js]
Tạo các Endpoint: 
- `GET /api/posts`: Lấy tất cả bài viết cùng danh sách Bình luận đính kèm.
- `POST /api/posts`: Đăng bài mới.
- `DELETE /api/posts/:id`: Xóa bài viết.
- `POST /api/posts/:id/comments`: Thêm bình luận vào bài viết.

#### [MODIFY] [server.js]
- Import và thực thi Lệnh tạo bảng `await Post.sync()` và `await Comment.sync()`.
- Chỉnh sửa file để cấu trúc liên kết `Post.hasMany(Comment)` và `Comment.belongsTo(Post)`.

### Frontend (React + Vite)
Giao diện phải được thiết kế sao cho đẹp như một cuốn "Sổ lưu bút" với danh sách thẻ hiển thị trực quan.

#### [NEW] [src/pages/News.jsx] & [News.css]
- Xây dựng Giao diện: Hiển thị Thẻ Bài đăng (có Badge Category).
- Ô nhập liệu văn bản lớn (`<textarea>`) dành cho Quản trị viên/User đăng bài. Khi đọc bài, ngắt đoạn tự động (`white-space: pre-wrap`) để chia đoạn văn rõ ràng.
- **Tính năng Bình Luận:** Mỗi bài đăng sẽ có nút "Xem/Bình luận". Khi bấm vào sẽ mở rộng danh sách các bình luận bên dưới và cung cấp 1 ô nhập để gửi bình luận mới.

#### [MODIFY] [src/App.jsx]
Thêm đường dẫn Route `<Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />`.

#### [MODIFY] [src/components/layout/Sidebar.jsx]
Gắn nút **"Bảng tin & Ký sự"** với icon dạng tờ báo (`Newspaper` hoặc `FileText` từ `lucide-react`) vào menu chính trị.
