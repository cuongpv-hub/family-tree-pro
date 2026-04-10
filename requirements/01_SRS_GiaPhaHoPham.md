# Software Requirements Specification (SRS)
# Hệ thống Gia Phả Họ Phạm — v0.1

> **Tài liệu này do `@Market_Researcher` tổng hợp từ nghiên cứu thị trường và chuẩn SRS ngành.**
> Đây là nguồn sự thật duy nhất (`Single Source of Truth`) cho tất cả Agents.

---

## 1. Giới thiệu

### 1.1 Mục đích
Xây dựng nền tảng Web quản lý Gia phả toàn diện cho Họ Phạm, tích hợp: quản lý thành viên, cây phả hệ trực quan, thư viện ảnh riêng tư, lịch sự kiện dòng họ và kế toán quỹ minh bạch.

### 1.2 Phạm vi hệ thống
- **Người dùng mục tiêu:** Trưởng họ (Admin), thành viên được cấp tài khoản (User)
- **Nền tảng:** Web App (Desktop-first, Responsive mobile)
- **Stack:** React + Node.js/Express + SQLite (Sequelize)

### 1.3 Định nghĩa thuật ngữ
| Thuật ngữ | Định nghĩa |
|---|---|
| Admin | Trưởng tộc — toàn quyền hệ thống |
| User | Thành viên được cấp tài khoản — quyền hạn chế |
| Member | Hồ sơ thành viên trên cây gia phả (không bắt buộc có tài khoản) |
| FundTransaction | Bản ghi thu/chi trong Quỹ dòng họ |

---

## 2. Yêu cầu chức năng (Functional Requirements)

### FR-01: Xác thực & Phân quyền
| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-01-1 | Hệ thống phải hỗ trợ đăng nhập bằng username/password | 🔴 Bắt buộc |
| FR-01-2 | Phân quyền 2 vai trò: ADMIN và USER | 🔴 Bắt buộc |
| FR-01-3 | ProtectedRoute chặn người chưa đăng nhập | 🔴 Bắt buộc |
| FR-01-4 | Admin có thể tạo/xóa/sửa tài khoản User | 🔴 Bắt buộc |
| FR-01-5 | Tài khoản User được liên kết với hồ sơ Member (memberId) | 🟡 Nên có |

### FR-02: Quản lý Thành viên
| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-02-1 | Thêm/Sửa/Xóa hồ sơ thành viên | 🔴 Bắt buộc |
| FR-02-2 | Thông tin: Họ tên, Giới tính, Ngày sinh, Tình trạng sống/mất | 🔴 Bắt buộc |
| FR-02-3 | Địa chỉ liên hoàn Tỉnh/Huyện/Xã (Việt Nam) | 🔴 Bắt buộc |
| FR-02-4 | Tìm kiếm thành viên theo tên | 🟡 Nên có |
| FR-02-5 | Khi tạo thành viên, có thể tạo kèm tài khoản đăng nhập | 🟡 Nên có |
| FR-02-6 | Import/Export danh sách (CSV/GEDCOM) | 🟢 Tùy chọn |

### FR-03: Sơ đồ Cây gia phả
| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-03-1 | Hiển thị cây phả hệ dạng Top-Down đệ quy | 🔴 Bắt buộc |
| FR-03-2 | Hỗ trợ Zoom In/Out và kéo Pan | 🔴 Bắt buộc |
| FR-03-3 | Thêm con/cháu trực tiếp từ Node trên cây | 🔴 Bắt buộc |
| FR-03-4 | Sửa thông tin Node ngay trên cây | 🟡 Nên có |
| FR-03-5 | Admin có thể xóa cả nhánh (Cascade Delete) | 🟡 Nên có |
| FR-03-6 | Hỗ trợ nhiều dạng biểu đồ (Fan chart, Hourglass) | 🟢 Tùy chọn |

### FR-04: Thư viện ảnh (Private Gallery)
| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-04-1 | Upload ảnh kèm ghi chú | 🔴 Bắt buộc |
| FR-04-2 | Ảnh Công khai / Riêng tư (isShared toggle) | 🔴 Bắt buộc |
| FR-04-3 | User chỉ thấy ảnh của mình + ảnh công khai | 🔴 Bắt buộc |
| FR-04-4 | Admin xem và xóa được tất cả ảnh | 🔴 Bắt buộc |
| FR-04-5 | Giới hạn kích thước file upload (5MB) | 🟡 Nên có |
| FR-04-6 | Hiển thị tên người đăng + badge trạng thái | 🟡 Nên có |

### FR-05: Lịch sự kiện
| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-05-1 | Tạo/Xóa sự kiện (Đám Giỗ, Họp Họ, Lễ Tết...) | 🔴 Bắt buộc |
| FR-05-2 | Lưu ngày, địa điểm, mô tả | 🔴 Bắt buộc |
| FR-05-3 | Hiển thị sự kiện sắp tới trên Dashboard | 🟡 Nên có |
| FR-05-4 | Thông báo nhắc trước sự kiện | 🟢 Tùy chọn |

### FR-06: Quản lý Quỹ Dòng Họ
| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-06-1 | Lập phiếu Thu (IN) / Chi (OUT) | 🔴 Bắt buộc |
| FR-06-2 | Tự động tính Số dư: SUM(IN) - SUM(OUT) | 🔴 Bắt buộc |
| FR-06-3 | Phân loại theo danh mục (Giỗ chạp, Khuyến học...) | 🔴 Bắt buộc |
| FR-06-4 | Đính kèm ảnh biên lai cho mỗi giao dịch | 🟡 Nên có |
| FR-06-5 | Báo cáo thu chi theo tháng (biểu đồ cột) | 🟡 Nên có |
| FR-06-6 | Phân tích chi tiêu theo danh mục | 🟡 Nên có |
| FR-06-7 | Theo dõi thành viên chưa đóng quỹ | 🟢 Tùy chọn |
| FR-06-8 | Xuất báo cáo PDF | 🟢 Tùy chọn |

---

## 3. Yêu cầu phi chức năng (Non-Functional Requirements)

### NFR-01: Giao diện & Trải nghiệm
| ID | Yêu cầu |
|---|---|
| NFR-01-1 | Flat Minimalist Design — KHÔNG dùng glassmorphism/gradient màu mè |
| NFR-01-2 | Tông màu nhấn: Electric Blue `#0071ff` |
| NFR-01-3 | Font chữ: Inter hoặc tương đương |
| NFR-01-4 | Responsive — hoạt động trên mobile |
| NFR-01-5 | Thanh cuộn mỏng kiểu macOS |
| NFR-01-6 | Animation mượt mà khi focus input, hover card |

### NFR-02: Hiệu năng
| ID | Yêu cầu |
|---|---|
| NFR-02-1 | Trang load < 2 giây trên kết nối thông thường |
| NFR-02-2 | API response < 500ms |

### NFR-03: Bảo mật
| ID | Yêu cầu |
|---|---|
| NFR-03-1 | Ảnh riêng tư không truy cập được nếu không đăng nhập |
| NFR-03-2 | Phân quyền API-level (không chỉ UI) |

---

## 4. Acceptance Criteria (Tiêu chí nghiệm thu) cho `@Tester`

### AC-01: Đăng nhập
- [ ] Đăng nhập đúng → vào Dashboard
- [ ] Đăng nhập sai → hiện thông báo lỗi
- [ ] Chưa đăng nhập truy cập `/members` → redirect về `/login`

### AC-02: Quản lý Thành viên
- [ ] Thêm thành viên mới → xuất hiện trong danh sách
- [ ] Tick "Tạo tài khoản" → tài khoản xuất hiện trong `/admin-users`
- [ ] Xóa thành viên (Admin) → biến mất khỏi danh sách và cây

### AC-03: Cây Gia phả
- [ ] Hiển thị đúng quan hệ cha-con
- [ ] Zoom In/Out hoạt động
- [ ] Thêm con vào node → node mới xuất hiện ngay trên cây

### AC-04: Thư viện ảnh
- [ ] Upload ảnh thành công → hiển thị trong gallery
- [ ] Ảnh Private → User khác không thấy
- [ ] Admin xem được tất cả ảnh
- [ ] Badge "Công khai/Riêng tư" hiển thị đúng

### AC-05: Quỹ Dòng Họ
- [ ] Lập Phiếu Thu → Số dư tăng đúng
- [ ] Lập Phiếu Chi → Số dư giảm đúng
- [ ] Đính kèm ảnh biên lai → thumbnail hiển thị trên card giao dịch
- [ ] Biểu đồ tháng phản ánh đúng dữ liệu vừa nhập
- [ ] Danh mục hiển thị đúng màu tag

---

## 5. Roadmap tính năng tương lai

| Version | Tính năng |
|---|---|
| v0.2 | Theo dõi thành viên chưa đóng quỹ |
| v0.2 | Xuất báo cáo Quỹ ra PDF |
| v0.3 | Thông báo nhắc sự kiện qua email |
| v0.3 | Import dữ liệu từ file Excel |
| v1.0 | Mobile App (React Native) |
| v1.0 | Tích hợp thanh toán online (VNPAY/Momo) |
