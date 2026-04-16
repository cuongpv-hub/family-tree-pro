# Báo Cáo Phân Tích Kiến Trúc Máy Trạm (Architectural Review)

**Người đánh giá:** The Architect Agent
**Dự án:** Ho-Pham Family Tree (Cross-Platform Version 2.0)
**Thời điểm đánh giá:** Ngay sau mốc hợp nhất Mobile (CapacitorJS)

---

## 1. Sơ Đồ Khối (Mô Hình Rễ Cây) Hiện Tại

Dưới đây là hình vẽ trực quan diễn giải luồng trao đổi dữ liệu từ thiết bị của Người dùng (Client) đục thẳng xuống Ổ cứng (Database) của Hệ thống.

```mermaid
flowchart TD
    %% Định dạng phong cách màu sắc
    classDef client fill:#1aa3ff,stroke:#0088cc,stroke-width:2px,color:#fff
    classDef mobile fill:#34d399,stroke:#059669,stroke-width:2px,color:#fff
    classDef network fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
    classDef backend fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef db fill:#ec4899,stroke:#be185d,stroke-width:2px,color:#fff

    subgraph "Tầng Hiển Thị (Frontend Layer) - React / Vite"
        WEB("💻 Trình duyệt Web (PC/Mac)"):::client
        APP("📱 Android/iOS App (Capacitor)"):::mobile
    end

    ax(("🔌 Trạm Giao Thức (axiosClient.js)\n[Luân chuyển: VITE_API_URL]")):::network

    subgraph "Tầng Máy Chủ (Backend Layer) - Node.js / Express"
        api("Đầu Mút API (app.listen 0.0.0.0)"):::backend
        auth{"Khóa Bảo Mật (JWT / Middleware)"}
        
        subgraph "Tầng Nghiệp Vụ (Controllers)"
            C1["Auth Controller"]
            C2["Member (Gia Phả)"]
            C3["Posts (Bảng Tin)"]
            C4["Events & Funds"]
        end
    end

    subgraph "Tầng Lưu Trữ (Data Layer) - SQLite"
        ORM["Màng Lọc ORM (Sequelize)"]:::db
        SQL[("💽 File Database Nội Sinh\n(database.sqlite)")]:::db
    end

    %% Các luồng kết nối
    WEB -->|Gọi API| ax
    APP -->|Gọi API| ax
    
    ax == "HTTP/HTTPS (LAN / Public)" ==> api
    
    api --> auth
    auth -- "Hợp lệ" --> C1
    auth -- "Hợp lệ" --> C2
    auth -- "Hợp lệ" --> C3
    auth -- "Hợp lệ" --> C4
    
    C1 --> ORM
    C2 --> ORM
    C3 --> ORM
    C4 --> ORM
    
    ORM --> SQL
```

---

## 2. Đánh Giá Điểm Mạnh Kiến Trúc Hiện Tại

- **Single Source of Truth (1 Nguồn Code Duy Nhất)**: Lõi ReactJS hiện tại được bọc bởi `CapacitorJS`, xuất đa nền tảng.
- **Tính Di Động Dữ Liệu Rất Cao (SQLite)**: Toàn bộ Cây Gia Phả được đóng gói trong một file vật lý duy nhất. 
- **Bảo Mật Tầng Tiêu Chuẩn (JWT)**: Hệ thống dùng chìa khóa JSON Web Token.

---

## 3. Lỗ Hổng Nút Thắt (Bottlenecks)

1. **Rào Cản Mở Rộng Hình Ảnh (Storage Scale System):** Database sẽ quá tải nếu lưu ảnh dưới dạng Base64. (Nên dùng Cloudinary)
2. **Rào Cản Về Lưu Lượng Gia Phả (Data Rendering Tree):** Render quá nhiều Node sẽ giật. (Nên dùng LazyLoading)
3. **Cơ chế Thông Báo Đẩy Thời Gian Thực (Push Notification / Socket.io)**: Thiếu WebSockets để gửi Noti.
