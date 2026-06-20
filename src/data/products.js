export const PRODUCTS = [
  {
    id: 'classic-oak-10x15',
    slug: 'classic-oak-10x15',
    name: 'Classic Oak 10×15',
    shortName: 'Classic Oak',
    category: 'Để bàn',
    size: '10x15',
    price: 79000,
    compareAtPrice: 99000,
    image: '/products/classic-oak.svg',
    badge: 'Bán chạy',
    rating: 4.9,
    reviewCount: 128,
    description: 'Khung gỗ sồi sáng màu, bo cạnh mềm mại, phù hợp bàn làm việc và kệ sách.',
    features: ['Gỗ sồi tự nhiên', 'Mặt mica chống xước', 'Dựng ngang hoặc dọc', 'Bảo hành 6 tháng'],
    colors: ['Sồi sáng', 'Nâu mật ong'],
  },
  {
    id: 'walnut-memory-13x18',
    slug: 'walnut-memory-13x18',
    name: 'Walnut Memory 13×18',
    shortName: 'Walnut Memory',
    category: 'Quà tặng',
    size: '13x18',
    price: 109000,
    compareAtPrice: 129000,
    image: '/products/walnut-memory.svg',
    badge: 'Quà tặng',
    rating: 4.8,
    reviewCount: 94,
    description: 'Tông óc chó ấm áp, thiết kế sang trọng cho ảnh kỷ niệm, sinh nhật và ngày lễ.',
    features: ['Vân gỗ óc chó', 'Kèm hộp quà kraft', 'In ảnh chất lượng cao', 'Tặng thiệp lời chúc'],
    colors: ['Óc chó', 'Nâu cacao'],
  },
  {
    id: 'gallery-pine-15x21',
    slug: 'gallery-pine-15x21',
    name: 'Gallery Pine 15×21',
    shortName: 'Gallery Pine',
    category: 'Treo tường',
    size: '15x21',
    price: 139000,
    compareAtPrice: 169000,
    image: '/products/gallery-pine.svg',
    badge: 'Mới',
    rating: 4.7,
    reviewCount: 61,
    description: 'Khung thông tối giản, tỷ lệ cân đối, tạo điểm nhấn nhẹ nhàng cho phòng ngủ và phòng khách.',
    features: ['Gỗ thông chọn lọc', 'Móc treo ẩn', 'Mặt mica trong', 'Lắp ảnh dễ dàng'],
    colors: ['Thông tự nhiên', 'Trắng kem'],
  },
  {
    id: 'ar-story-premium',
    slug: 'ar-story-premium',
    name: 'AR Story Premium',
    shortName: 'AR Story',
    category: 'Tích hợp AR',
    size: '15x21',
    price: 169000,
    compareAtPrice: 199000,
    image: '/products/ar-story.svg',
    badge: 'AR độc quyền',
    rating: 5,
    reviewCount: 47,
    description: 'Khung ảnh cá nhân hóa kèm QR AR, hiệu ứng chuyển động và lời nhắn riêng khi quét bằng điện thoại.',
    features: ['QR AR riêng cho từng khung', '3 hiệu ứng chuyển động', 'Tùy chỉnh lời nhắn', 'Hỗ trợ thiết kế 1:1'],
    colors: ['Nâu cổ điển', 'Sồi sáng'],
    includesAR: true,
  },
];

export const PRODUCT_CATEGORIES = ['Tất cả', ...new Set(PRODUCTS.map((product) => product.category))];

export function getProductBySlug(slug) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
}
