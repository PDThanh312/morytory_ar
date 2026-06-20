import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Gift, Heart, MessageCircle, QrCode, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react';
import StoreLayout from './layout/StoreLayout';
import ProductCard from './shop/ProductCard';
import { PRODUCTS } from '../data/products';

const steps = [
  { icon: Camera, title: 'Chọn ảnh', text: 'Tải khoảnh khắc bạn yêu thích lên trình thiết kế.' },
  { icon: Sparkles, title: 'Cá nhân hóa', text: 'Chọn khung, lời nhắn và hiệu ứng AR riêng.' },
  { icon: Gift, title: 'Nhận món quà', text: 'MoryTory hoàn thiện, đóng gói và giao tận nơi.' },
];

export default function HomePage() {
  return (
    <StoreLayout>
      <section className="relative overflow-hidden border-b border-brand-wood/10 bg-[#fffaf2]">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-accent-beige blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#dbe4cf] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-wood/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-wood"><Sparkles className="h-4 w-4" /> Kỷ niệm sống động cùng AR</span>
            <h1 className="mt-7 max-w-3xl font-serif text-5xl font-bold leading-[1.08] text-[#2c2118] sm:text-6xl lg:text-7xl">Một chiếc khung. <span className="text-brand-wood">Cả một câu chuyện.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">Khung ảnh gỗ cá nhân hóa kết hợp QR và hiệu ứng AR, giúp khoảnh khắc không chỉ được nhìn thấy mà còn được sống lại.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/design" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-wood px-7 py-4 font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#72461f]">Thiết kế khung của bạn <ArrowRight className="h-5 w-5" /></Link><Link to="/products" className="inline-flex items-center justify-center rounded-full border border-brand-wood/25 bg-white px-7 py-4 font-semibold text-brand-wood transition hover:bg-brand-accent-beige">Xem bộ sưu tập</Link></div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-gray-500"><span className="flex items-center gap-2"><Truck className="h-4 w-4 text-brand-accent-green" /> Giao hàng toàn quốc</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-accent-green" /> Bảo hành 6 tháng</span><span className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9/5 từ khách hàng</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-5 top-16 z-10 rounded-2xl bg-white p-4 shadow-xl"><p className="text-xs text-gray-400">Quét để xem</p><p className="mt-1 flex items-center gap-2 font-semibold text-brand-wood"><QrCode className="h-5 w-5" /> Trải nghiệm AR</p></div>
            <div className="absolute -right-3 bottom-12 z-10 rounded-2xl bg-white p-4 shadow-xl"><p className="flex items-center gap-2 text-sm font-semibold"><Heart className="h-5 w-5 fill-rose-400 text-rose-400" /> Món quà có một không hai</p></div>
            <div className="rotate-2 rounded-[40px] border border-white/80 bg-white/70 p-5 shadow-2xl backdrop-blur"><img src="/products/ar-story.svg" alt="Khung ảnh AR MoryTory" className="w-full rounded-[30px]" /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-green">Sản phẩm nổi bật</p><h2 className="mt-2 font-serif text-4xl font-bold">Khung ảnh được yêu thích</h2></div><Link to="/products" className="inline-flex items-center gap-2 font-semibold text-brand-wood">Xem tất cả <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{PRODUCTS.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="bg-[#2f231a] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c9df9c]">Cách MoryTory hoạt động</p><h2 className="mt-3 font-serif text-4xl font-bold leading-tight">Từ một tấm ảnh đến món quà mang dấu ấn riêng</h2><p className="mt-5 max-w-lg leading-7 text-white/65">Không cần kỹ năng thiết kế. Chỉ vài bước đơn giản để tạo khung ảnh gỗ có lời nhắn và hiệu ứng chuyển động.</p><Link to="/design" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-wood">Bắt đầu ngay <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-4 sm:grid-cols-3">{steps.map(({ icon: Icon, title, text }, index) => <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6"><span className="text-xs font-semibold text-[#c9df9c]">0{index + 1}</span><Icon className="mt-8 h-8 w-8 text-[#c9df9c]" /><h3 className="mt-4 font-serif text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></div>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-[36px] bg-gradient-to-br from-[#efe1ce] to-[#dce5d4] p-7 sm:p-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4"><img className="mt-10 rounded-3xl shadow-lg" src="/products/walnut-memory.svg" alt="Khung ảnh quà tặng" /><img className="rounded-3xl shadow-lg" src="/products/gallery-pine.svg" alt="Khung ảnh treo tường" /></div>
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-green">Không chỉ là khung ảnh</p><h2 className="mt-3 font-serif text-4xl font-bold">Chạm vào cảm xúc bằng câu chuyện của riêng bạn</h2><p className="mt-5 leading-7 text-gray-600">Mỗi mã QR được gắn với một trải nghiệm AR riêng. Người nhận chỉ cần quét bằng camera để thấy hiệu ứng, lời chúc và khoảnh khắc sống động trên chính tấm ảnh.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><p className="flex gap-2 text-sm"><QrCode className="h-5 w-5 text-brand-wood" /> QR riêng cho từng sản phẩm</p><p className="flex gap-2 text-sm"><Sparkles className="h-5 w-5 text-brand-wood" /> Hiệu ứng AR tùy chọn</p><p className="flex gap-2 text-sm"><Heart className="h-5 w-5 text-brand-wood" /> Lời nhắn cá nhân hóa</p><p className="flex gap-2 text-sm"><MessageCircle className="h-5 w-5 text-brand-wood" /> AI hỗ trợ chọn quà</p></div></div>
        </div>
      </section>

      <section className="border-y border-brand-wood/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-green">Khách hàng nói gì</p><h2 className="mt-2 font-serif text-4xl font-bold">Những câu chuyện đã được trao đi</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{[
          ['“Khung đẹp hơn ảnh, QR AR khiến người nhận bất ngờ thật sự.”', 'Minh Anh', 'Quà sinh nhật'],
          ['“Trình thiết kế dễ dùng, mình hoàn thành món quà trong chưa đầy 10 phút.”', 'Quốc Huy', 'Quà kỷ niệm'],
          ['“Đóng gói chỉn chu, khung gỗ chắc và màu ảnh rất đẹp.”', 'Thảo Vy', 'Trang trí phòng'],
        ].map(([quote, name, context]) => <blockquote key={name} className="rounded-3xl border border-brand-wood/10 bg-brand-bg p-6 text-left"><div className="flex gap-1 text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div><p className="mt-5 font-serif text-xl leading-8">{quote}</p><footer className="mt-5 text-sm"><strong>{name}</strong><span className="ml-2 text-gray-400">· {context}</span></footer></blockquote>)}</div></div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6"><div className="rounded-[36px] bg-brand-wood px-6 py-14 text-white shadow-2xl"><h2 className="font-serif text-4xl font-bold">Sẵn sàng lưu giữ câu chuyện của bạn?</h2><p className="mx-auto mt-4 max-w-2xl text-white/70">Tạo khung ảnh cá nhân hóa ngay hôm nay. AI Mory sẽ hỗ trợ bạn chọn mẫu, kích thước và lời nhắn phù hợp.</p><Link to="/design" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-brand-wood">Thiết kế khung ngay <ArrowRight className="h-5 w-5" /></Link></div></section>
    </StoreLayout>
  );
}
