# Dự Án Web Quản Lý Gia Phả (GiaPhảPro) - Hệ Thống Tracking

> **Lưu ý dành cho AI (Dành cho các phiên làm việc sau):**
> Khi bắt đầu một phiên làm việc mới, hãy đọc nhanh file này để load lại toàn bộ bộ nhớ (context) về các tác vụ đã hoàn thiện, kiến trúc công nghệ và việc cần làm tiếp theo mà không cần phải phân tích lại từ đầu.

## 1. Công nghệ & Kiến Trúc
- **Platform**: Vite + ReactJS.
- **Styling**: Vanilla CSS. Thống nhất sử dụng **Premium Dark Mode** định nghĩa tại `src/index.css` (Glassmorphism, ánh sáng tím indigo). 
- **Icons**: `lucide-react`.
- **Định tuyến (Routing)**: `react-router-dom` tại `App.jsx`.

## 2. Quá trình đã hoàn thiện (Tiến độ hiện tại)
✅ Lên kế hoạch và thông qua thiết kế cấu trúc App.
✅ Đã xoá bỏ code rác của Vite. Cài đặt các thư viện cần thiết.
✅ Đã viết file Global CSS (`index.css`), thiết lập các biến CSS màu sắc chuyên nghiệp.
✅ Hoàn thiện `Sidebar.jsx`: Thanh công cụ bên trái giao diện. 
✅ Hoàn thiện `Dashboard.jsx`: Trang chủ hiển thị card thông số và trạng thái. 

## 3. Các Công việc Ưu tiên cho Lần tiếp theo (Next Steps)
✅ **1.** Xây dựng xuất sắc trang **Quản lý Thành viên (`/members`)**: Thiết kế Form thu thập đủ thông tin (CCCD, Họ tên, Quê quán..), giao diện Dark Mode xịn, hiển thị List ngay lập tức.
⏳ **2.** Triển khai **Trang Cây Gia Phả (`/tree`)**: Đây là tính năng lớn nhất. Sẽ cần phân tích và dùng React Flow hoặc thuật toán vẽ Cây trực quan.
⏳ **3.** Code giao diện **Cài đặt (`/settings`)** và **Lịch sự kiện (`/events`)**.
⏳ **4.** Ráp nối luồng dữ liệu giả (Mock Data) chuẩn JSON để cây gia phả tự động nảy sinh nhánh.

---
*File này tự động lưu và đóng vai trò như não bộ dự án, được AI và lập trình viên cùng cập nhật song song mỗi khi chốt xong một hạng mục.*
