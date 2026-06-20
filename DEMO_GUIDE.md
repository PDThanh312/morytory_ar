# Kịch bản demo MoryTory (5–8 phút)

## Chuẩn bị

1. Chạy `npm install`.
2. Tạo `.dev.vars` từ `.dev.vars.example`.
3. Đặt email admin trong `ADMIN_EMAILS`.
4. Chạy `npm run dev:full`.
5. Mở `http://localhost:8788`.

## Kịch bản trình bày

### 1. Homepage

- Giới thiệu vấn đề: khung ảnh truyền thống chỉ hiển thị một khoảnh khắc tĩnh.
- Giới thiệu giải pháp: khung ảnh gỗ cá nhân hóa + QR AR.
- Cuộn qua sản phẩm nổi bật, quy trình 3 bước, review và CTA.

### 2. Product

- Vào `/products`.
- Demo tìm kiếm, lọc danh mục và sắp xếp giá.
- Mở chi tiết một sản phẩm.
- Chọn màu, số lượng và thêm vào giỏ.

### 3. Thiết kế AR

- Đăng nhập.
- Vào `/design`.
- Upload ảnh.
- Chọn kích thước, hiệu ứng AR và lời nhắn.
- Thêm thiết kế vào giỏ.

### 4. Checkout và payment

- Mở giỏ hàng.
- Nhập thông tin giao hàng.
- Chọn một trong ba phương thức:
  - COD.
  - Chuyển khoản: hệ thống hiển thị QR demo.
  - Cổng thanh toán demo: hệ thống đánh dấu giao dịch thành công.
- Xác nhận đơn.
- Với thiết kế AR, màn hình thành công hiển thị QR trải nghiệm.

### 5. User order tracking

- Vào `/orders`.
- Xem sản phẩm, tổng tiền, trạng thái đơn và trạng thái thanh toán.
- Mở link AR nếu đơn có sản phẩm cá nhân hóa.

### 6. Admin

- Đăng ký bằng email nằm trong `ADMIN_EMAILS`.
- Vào `/admin`.
- Trình bày dashboard:
  - Tổng tài khoản.
  - Tổng đơn.
  - Doanh thu đã thanh toán.
  - Số QR AR.
- Đổi trạng thái đơn và thanh toán.
- Đổi role của một tài khoản user thành admin.

### 7. Chatbot AI

- Bấm “Hỏi Mory AI”.
- Hỏi:
  - “Mẫu nào hợp làm quà sinh nhật?”
  - “AR hoạt động như thế nào?”
  - “Phí ship bao nhiêu?”
- Không có API key: chatbot chạy FAQ demo.
- Có `OPENAI_API_KEY`: chatbot gọi AI thật qua backend.

## Câu chốt

MoryTory đã có đầy đủ customer journey từ khám phá sản phẩm → cá nhân hóa → giỏ hàng → thanh toán → theo dõi đơn → quản trị, đồng thời tạo khác biệt bằng trải nghiệm AR và trợ lý AI.
