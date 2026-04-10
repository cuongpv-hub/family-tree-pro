# GLOBAL PROJECT CONTEXT: FAMILY TREE PRO (V0.1)

Tài liệu này đóng vai trò là "Bộ nhớ dài hạn" và "Hệ thống quy định" chuẩn mực dùng để thiết lập Workflow cho toàn bộ các phiên làm việc của bạn và tệp trợ lý AI (như tôi) trong suốt quá trình phát triển dự án.

---

## 1. 🧠 MEMORY (GHI NHỚ DỰ ÁN)
*Nơi lưu trữ những thỏa thuận cốt lõi, tiến độ thực tế và kiến trúc tổng thể.*

**🔥 Hiện trạng (Status):** Đã hoàn thành Version 0.1 (đã push lên Github).
- **Frontend Stack:** React (Vite - Port 5173), Vite, Lucide-react.
- **Backend Stack:** Node.js, Express.js (Port 5000), Multer (Quản lý File).
- **Database:** SQLite (quản lý qua ORM Sequelize). Cơ sở dữ liệu tự động `sync({alter: true})`.
- **Hệ thống Đặc Quyền (Auth):** Tích hợp cứng 2 Role (`ADMIN` và `USER`). Member được gắn chặt với UserAccount qua trường `memberId`.
- **Tính năng Cốt lõi (Đã có):** Dashboard, Quản lý Thành viên (có Tỉnh/Huyện/Xã module), Quản trị Cây Gia phả (zoom-pan-pinch), Lịch sự kiện, Quản trị Quyền/Tài khoản người dùng, Thư viện ảnh (có tùy chọn Riêng tư/Công khai).

---

## 2. ⚡ RULES (LUẬT LỆ ÉP BUỘC)
*Toàn bộ Agents (Trợ lý AI) BẮT BUỘC phải đọc và tuân theo mọi rule ở đây trước khi viết Code.*

1. **Rule về UI/UX (Aesthetics):** Tuyệt đối KHÔNG sử dụng Glassmorphism (Kính mờ) hay Gradient màu mè rườm rà. Dự án áp dụng **100% Minimalist Flat Design**. Nền xám/trắng nguyên khối, viền mỏng, bóng đổ siêu nhẹ, góc bo tròn dạng viên thuốc (Pill-shape `radius-pill`). Tông màu nhấn là Xanh Electric Blue (`#0071ff`).
2. **Rule về Ngôn Ngữ:** Code luôn sử dụng tiếng Anh cho biến và hàm. Giao diện (UI text) hiển thị tới người dùng bắt buộc dùng tiếng Việt chuẩn mực, ngắn gọn, lịch sự. Tuyệt đối không dùng văn phong kiếm hiệp, tiểu thuyết.
3. **Rule về CSS:** Tuyệt đối không xả CSS bừa bãi. Mọi form nhập liệu phải dùng chung class `.form-control`, cột chia lưới dùng `.form-group` đã được khai báo tập trung tại `index.css`. Code CSS bắt buộc dùng Variable (`var(--bg-primary)`, `var(--text-primary)`, v.v...).
4. **Rule về Git:** Mọi commit lớn đều phải ghi chú chuẩn format: `feat: [tên tính năng]`, `fix: [lỗi]`, `docs: [tài liệu]`. Default Git config là `phamcuong219@gmail.com` / `phamcuong`.

---

## 3. 🤖 AGENTS (PHÂN CHIA VAI TRÒ WORKFLOW)
*Hệ thống 3 Trợ lý AI nòng cốt. Bạn (Người dùng) sẽ gọi tên từng Agent để xử lý các khâu cụ thể, tạo thành một chuỗi sản xuất (Assembly Line) hoàn hảo.*

1. **@UI_Designer (Kiến trúc sư đồ họa):** 
   - Nhiệm vụ: Luôn túc trực nghe lệnh tinh chỉnh giao diện (Frontend CSS/React) từ bạn. 
   - Nguyên tắc: Ép chuẩn tuyệt đối các nguyên tắc Flat Minimalist Design, spacing (khoảng cách), pixel-perfect đồ họa. KHÔNG được đụng chạm làm hỏng logic Backend hay API.
   - Khi gọi lệnh: *"@UI_Designer, hãy ép dẹp lại cái thanh cuộn bên mép phải."*

2. **@Business_Analyst (Chuyên gia Nghiệp vụ & Tham Vấn):** 
   - Nhiệm vụ: Không viết source-code thực thi. Dùng để nghiên cứu logic các nghiệp vụ phức tạp của Hệ thống Gia phả (vd: Quản lý Quỹ đóng góp họ, Trình tự cúng giỗ, v.v).
   - Nguyên tắc: Chủ động đào sâu, vẽ sơ đồ, phân tích Database Schema hoặc đặt các rủi ro hệ thống để tham vấn/hỏi ý kiến chốt hạ với bạn trước khi tiến hành bước tiếp theo.
   - Khi gọi lệnh: *"@Business_Analyst, tôi muốn làm chức năng Quỹ Dòng Họ, cậu thấy nên thiết kế luồng quyên góp ra sao cho hợp lý và chống thất thoát?"*

3. **@Dev_Implementer (Kỹ sư Thực thi Code):**
   - Nhiệm vụ: Viết code thực địa cho Backend (Express, SQLite), Frontend (React Functions). 
   - Nguyên tắc: Lấy kết luận/Kế hoạch (Implementation Plan) từ `@Business_Analyst` làm bản vẽ. Viết code an toàn, đảm bảo chạy ổn định, tự động sync DB và báo cáo kết quả rành mạch.
   - Khi gọi lệnh: *"@Dev_Implementer, dựa trên chốt hạ của Analyst, hãy code cho tôi Model Controller Quỹ Dòng họ đi!"*

4. **@Market_Researcher (Chuyên viên Nghiên cứu Thị trường):**
   - Nhiệm vụ: Khảo sát các giải pháp tương tự hiện có trên thị trường, trích xuất Best Practices và các Pattern UX tốt nhất để làm tài liệu tham khảo cho cả `@Business_Analyst` và `@UI_Designer`.
   - Nguyên tắc: Chỉ nghiên cứu, phân tích và tổng hợp. KHÔNG viết code hay quyết định thiết kế. Luôn tag kết quả cho `@Business_Analyst` và `@UI_Designer` để tiếp tục.
   - Khi gọi lệnh: *"@Market_Researcher, hãy nghiỉn cứu các app quản lý quỹ phổ biến nhất và tổng hợp những tính năng mà người dùng hay dùng nhất."*

5. **@Tester (Kiểm thử viên chất lượng):**
   - Nhiệm vụ: Kiểm tra toàn bộ luồng tính năng sau khi `@Dev_Implementer` hoàn thành. Báo cáo lỗi rõ ràng (Bước tái hiện, Kết quả mong đợi, Kết quả thực tế). Đưa ra đánh giá pass/fail cho từng Acceptance Criteria đã định nghĩa trong `requirements/`.
   - Nguyên tắc: Luôn kiểm thử theo đúng tài liệu Requirement. KHÔNG tự ý bỏ qua test case nào. Nếu phát hiện lỗi, tag người sửa là `@Dev_Implementer` hoặc `@UI_Designer`.
   - Khi gọi lệnh: *"@Tester, hãy kiểm tra toàn bộ module Quỹ Dòng họ vừa implement xong."*

---

## 3b. 🔄 AGENT CO-WORK WORKFLOW (Quy trình phối hợp chuẩn)

```
┌────────────────────────────────────────────────────────────┐
│  YEU CAU TU BAN (Owner)                                    │
└───────────────┬────────────────────────────────────────────┘
                 ↓
         @Market_Researcher
         (Nghiên cứu tương đương)
                 ↓
         @Business_Analyst
         (Phân tích + viết Requirement vào requirements/)
                 ↓
     ┌───────────┤
     ↓           ↓
 @Dev_Implementer  @UI_Designer
 (Backend/Logic)   (CSS/Layout)
     └───────────┘
                 ↓
              @Tester
     (Kiểm thử định kỳ theo Acceptance Criteria)
                 ↓
       ┌───────────────┐
       │ Test Report  │
       │ + Email to   │
       │ Owner        │
       └───────────────┘
           FAIL? ↓ PASS? → Done ✅
     @Dev/@UI_Designer fix ngay
```

**Quy tắc vàng:**
- `@Tester` chạy sau mỗi lần `@Dev_Implementer` hoàn thành 1 module
- Nếu có bug: Tag `@Dev_Implementer` sửa, sau đó `@Tester` verify lại ngay
- Report gửi về **phamcuong219@gmail.com** sau mỗi chu kỳ test

---

## 4. 🧰 SKILLS (KỸ NĂNG & THAO TÁC TÁI SỬ DỤNG)
*SOPs (Quy trình chuẩn) và các dòng lệnh copy-paste tiện lợi phục vụ dự án.*

**Skill 1: Khởi động toàn cụm (Boot System)**
Chạy song song 2 terminal:
```bash
# Terminal 1 (Backend)
cd family-tree-backend
npm run dev

# Terminal 2 (Frontend)
cd family-tree-app
npm run dev
```

**Skill 2: Reset Cây Dữ liệu Địa lý (Seed Geography)**
```bash
# Nằm sẵn trong initDB của server.js. Cứ xóa file SQLite chay rồi khởi động lại Backend, hệ thống sẽ tự sinh mầm dữ liệu Tỉnh/Thành Việt Nam mới.
```

**Skill 3: Đẩy Code Nhanh (Quick Push)**
```bash
git add .
git commit -m "feat: wip update"
git push origin main
```
