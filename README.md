# MoryTory — EXE201 Product Demo

MoryTory là website thương mại điện tử bán khung ảnh gỗ cá nhân hóa, có trình thiết kế ảnh, QR trải nghiệm AR, tài khoản người dùng, phân quyền quản trị, checkout/thanh toán demo và chatbot AI.

## Chức năng đã hoàn thiện

### Khách hàng

- Homepage đầy đủ: hero, sản phẩm nổi bật, quy trình đặt hàng, điểm khác biệt, đánh giá và CTA.
- Trang danh sách sản phẩm `/products`:
  - Tìm kiếm.
  - Lọc theo danh mục.
  - Sắp xếp theo giá và đánh giá.
- Trang chi tiết sản phẩm `/products/:slug`:
  - Chọn màu khung.
  - Chọn số lượng.
  - Thêm giỏ hàng.
  - Điều hướng sang thiết kế AR.
- Giỏ hàng:
  - Lưu sản phẩm catalog trong `localStorage`.
  - Tăng/giảm số lượng.
  - Xóa sản phẩm.
  - Tính tạm tính và phí giao hàng.
- Checkout:
  - Thông tin giao hàng.
  - COD.
  - Chuyển khoản ngân hàng với QR demo.
  - Cổng thanh toán mô phỏng thành công.
  - Miễn phí vận chuyển từ 300.000đ, dưới mức này phí 30.000đ.
- Trang đơn hàng cá nhân `/orders`:
  - Xem lịch sử mua hàng.
  - Xem trạng thái đơn và thanh toán.
  - Mở trải nghiệm AR cho sản phẩm cá nhân hóa.
- Đăng ký, đăng nhập, đăng xuất và khôi phục phiên.
- Phân quyền `user` và `admin`.
- Chatbot Mory AI:
  - Có chế độ FAQ demo không cần API key.
  - Tự dùng OpenAI Responses API nếu cấu hình `OPENAI_API_KEY`.

### Thiết kế khung AR

- Upload JPG, PNG hoặc WebP tối đa 10 MB.
- Chọn kích thước 10×15, 13×18 hoặc 15×21.
- Chọn hiệu ứng tuyết, bụi phép thuật hoặc hoa anh đào.
- Nhập lời nhắn, chọn font và cỡ chữ.
- Xem preview trực tiếp.
- Tạo QR AR riêng cho từng thiết kế sau checkout.

### Quản trị

Trang `/admin` chỉ dành cho tài khoản `admin`:

- Thống kê tài khoản, đơn hàng, doanh thu đã thanh toán và số QR AR.
- Xem danh sách tài khoản.
- Nâng/hạ quyền tài khoản khác.
- Xem thông tin đơn hàng.
- Cập nhật trạng thái đơn:
  - Chờ xác nhận.
  - Đã xác nhận.
  - Đang chuẩn bị.
  - Đang giao.
  - Hoàn thành.
  - Đã hủy.
- Cập nhật trạng thái thanh toán.

## Công nghệ

- React 19
- React Router
- Vite 8
- Tailwind CSS
- Cloudflare Pages Functions
- Cloudflare Workers KV
- MindAR + A-Frame
- OpenAI Responses API (tùy chọn)

## Yêu cầu môi trường

Project dùng Vite 8 và Wrangler 4. Nên dùng:

```text
Node.js >= 22.12
```

Có thể dùng Node portable để không ảnh hưởng project Node 14 cũ.

## Chạy demo local

### 1. Cài package

```bash
npm install
```

Các dependency npm của A-Frame/MindAR đã được loại bỏ vì giao diện AR đang tải chúng qua CDN. Việc này tránh lỗi `canvas@2.11.2` trên Node 22.

### 2. Tạo file môi trường

Windows PowerShell:

```powershell
Copy-Item .dev.vars.example .dev.vars
notepad .dev.vars
```

Nội dung mẫu:

```env
AUTH_SECRET=morytory-local-demo-secret-change-this-123456789
ADMIN_EMAILS=thanhpd312@gmail.com

# Không bắt buộc. Bỏ trống thì chatbot vẫn chạy FAQ demo.
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini

BANK_NAME=MB Bank
BANK_ACCOUNT=0000000000
BANK_OWNER=MORYTORY DEMO
```

Không commit `.dev.vars` lên Git.

### 3. Chạy frontend + API + KV local

```bash
npm run dev:full
```

Mở:

```text
http://localhost:8788
```

Lệnh này tự build frontend và chạy Cloudflare Pages Functions. Dữ liệu tài khoản, đơn và QR demo được lưu tại `.wrangler/`.

## Tạo tài khoản admin local

1. Đặt email admin trong `.dev.vars`:

```env
ADMIN_EMAILS=thanhpd312@gmail.com
```

2. Mở `/register`.
3. Đăng ký đúng email trên.
4. Mật khẩu admin là mật khẩu tự nhập lúc đăng ký.
5. Sau khi đăng ký, truy cập `/admin`.

## Scripts

```bash
npm run dev       # Chỉ frontend Vite, không có API Cloudflare
npm run dev:full  # Build và chạy đầy đủ frontend + Functions + KV local
npm run lint      # Kiểm tra ESLint
npm run build     # Build production
npm run preview   # Preview riêng phần frontend đã build
```

## Biến môi trường

| Tên | Bắt buộc | Mục đích |
|---|---:|---|
| `AUTH_SECRET` | Có | Ký token đăng nhập, tối thiểu 32 ký tự |
| `ADMIN_EMAILS` | Có | Danh sách email admin khởi tạo |
| `OPENAI_API_KEY` | Không | Bật câu trả lời AI thật |
| `OPENAI_MODEL` | Không | Mặc định `gpt-5-mini` |
| `BANK_NAME` | Không | Tên ngân hàng demo |
| `BANK_ACCOUNT` | Không | Số tài khoản demo |
| `BANK_OWNER` | Không | Chủ tài khoản demo |

## API chính

### Công khai

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/chat`
- `GET /api/orders?id=<AR_ORDER_ID>`

### Cần đăng nhập

- `GET /api/auth/me`
- `POST /api/checkout`
- `GET /api/my-orders`
- `POST /api/orders` — API cũ, giữ để tương thích

### Chỉ admin

- `GET /api/admin/dashboard`
- `PATCH /api/admin/users`
- `PATCH /api/admin/purchases`

## Thanh toán

Bản EXE201 có đầy đủ UI và luồng trạng thái cho:

- COD.
- Chuyển khoản.
- Cổng thanh toán demo.

`demo_gateway` chỉ mô phỏng giao dịch thành công và không thu tiền thật. Khi đưa vào kinh doanh thật, cần thay bằng tích hợp chính thức của VNPay, MoMo, ZaloPay, Stripe hoặc nhà cung cấp phù hợp, đồng thời xác minh webhook phía server.

## Chatbot AI

- Không có `OPENAI_API_KEY`: chatbot trả lời từ FAQ có sẵn, phù hợp demo offline/local.
- Có `OPENAI_API_KEY`: `/api/chat` gọi OpenAI Responses API từ server, API key không lộ ra frontend.
- Có rate limit cơ bản theo IP cho login, register và chat.

## Kiểm tra đã thực hiện

- `npm install`: thành công, 0 vulnerabilities tại thời điểm build.
- `npm run lint`: thành công.
- `npm run build`: thành công.
- Wrangler local: chạy thành công tại `http://localhost:8788`.
- Đã test qua API local:
  - Đăng ký admin.
  - Đăng nhập.
  - Checkout thanh toán demo.
  - Xem đơn cá nhân.
  - Dashboard admin.
  - Chatbot FAQ demo.

## Lưu ý trước khi bán thật

Bản hiện tại phù hợp MVP và bài EXE201. Trước khi xử lý tiền hoặc dữ liệu khách hàng thật nên tiếp tục:

- Chuyển tài khoản và đơn hàng từ KV sang D1/PostgreSQL.
- Dùng cookie `HttpOnly`, `Secure`, `SameSite` thay cho token trong `localStorage`.
- Thêm xác minh email, quên mật khẩu và thu hồi session.
- Kết nối payment gateway thật và xác minh webhook.
- Dùng R2/Cloudflare Images thay vì lưu ảnh base64 lâu dài trong KV.
- Thêm Turnstile và rate limiting mạnh hơn.
- Bổ sung chính sách quyền riêng tư, điều khoản mua hàng và consent lưu ảnh.
