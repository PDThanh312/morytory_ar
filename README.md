# MoryTory AR

Website thiết kế và đặt khung ảnh gỗ tích hợp AR, xây dựng bằng React, Vite, Tailwind CSS và Cloudflare Pages Functions/KV.

## Chức năng tài khoản và phân quyền

Bản này đã bổ sung:

- Tạo tài khoản bằng họ tên, email và mật khẩu.
- Đăng nhập, đăng xuất và khôi phục phiên đăng nhập từ trình duyệt.
- Mật khẩu được băm bằng PBKDF2-SHA256 với salt riêng, không lưu mật khẩu thô.
- Phiên đăng nhập dùng token ký HMAC và hết hạn sau 7 ngày.
- Hai vai trò: `user` và `admin`.
- Route `/design` chỉ dành cho người đã đăng nhập.
- Route `/admin` và các API quản trị chỉ dành cho `admin`.
- Admin xem tài khoản, đơn hàng và có thể nâng/hạ quyền tài khoản khác.
- API tạo đơn yêu cầu đăng nhập và tự gắn đơn với tài khoản hiện tại.
- API AR công khai chỉ trả dữ liệu hiển thị AR, không làm lộ tên, số điện thoại hay địa chỉ khách hàng.

## Ma trận quyền

| Chức năng | Khách | user | admin |
|---|---:|---:|---:|
| Xem trang chủ | Có | Có | Có |
| Quét QR và xem AR | Có | Có | Có |
| Thiết kế và tạo đơn | Không | Có | Có |
| Xem trang quản trị | Không | Không | Có |
| Xem tài khoản, đơn hàng | Không | Không | Có |
| Phân quyền tài khoản khác | Không | Không | Có |

## Cấu hình bắt buộc

Project đang dùng KV binding `MORYTORY_ORDERS` cho cả đơn hàng và tài khoản, với các prefix riêng:

- `order_...`
- `user_...`

Cần cấu hình hai biến môi trường trong Cloudflare Pages:

```env
AUTH_SECRET=<chuỗi-ngẫu-nhiên-tối-thiểu-32-ký-tự>
ADMIN_EMAILS=admin@your-domain.com,owner@your-domain.com
```

`ADMIN_EMAILS` dùng để khởi tạo quyền quản trị. Sau khi deploy, hãy đăng ký bằng đúng một trong các email này. Admin sau đó có thể phân quyền các tài khoản khác trên trang `/admin`.

Không đưa `AUTH_SECRET` thật vào Git.

## Chạy local

```bash
npm install
cp .dev.vars.example .dev.vars
npm run build
npx wrangler pages dev dist
```

Chỉnh `.dev.vars` trước khi chạy. Chỉ chạy `npm run dev` sẽ mở giao diện Vite nhưng không cung cấp các Cloudflare Pages Functions `/api/*`.

## Build

```bash
npm run build
```

## API chính

### Công khai

- `POST /api/auth/register`: tạo tài khoản.
- `POST /api/auth/login`: đăng nhập.
- `GET /api/orders?id=...`: lấy dữ liệu AR công khai theo mã đơn.

### Cần đăng nhập

- `GET /api/auth/me`: lấy tài khoản hiện tại.
- `POST /api/orders`: tạo đơn hàng.

Header:

```http
Authorization: Bearer <token>
```

### Chỉ admin

- `GET /api/admin/dashboard`: danh sách tài khoản, đơn hàng và thống kê.
- `PATCH /api/admin/users`: đổi vai trò `user`/`admin` của tài khoản khác.

## Cấu trúc phần xác thực

```text
functions/
  _lib/auth.js
  api/auth/register.js
  api/auth/login.js
  api/auth/me.js
  api/admin/dashboard.js
  api/admin/users.js
src/
  auth/AuthContext.jsx
  auth/ProtectedRoute.jsx
  components/LoginPage.jsx
  components/RegisterPage.jsx
  components/AdminPage.jsx
```

## Lưu ý trước khi dùng production

- Bật HTTPS; camera AR và token đăng nhập không nên chạy trên HTTP công khai.
- Đặt `AUTH_SECRET` là chuỗi ngẫu nhiên mạnh và quản lý bằng biến bí mật của nền tảng.
- Nên bổ sung giới hạn số lần đăng nhập/đăng ký theo IP để chống brute force.
- Với quy mô lớn, nên chuyển tài khoản và đơn hàng sang D1/PostgreSQL thay vì dùng một KV namespace.
- Nên bổ sung xác minh email, quên mật khẩu và thu hồi phiên đăng nhập khi đổi mật khẩu.
