import { Link } from 'react-router-dom';
import { Camera, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-wood/10 bg-[#2d2017] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-serif text-2xl font-bold">MoryTory</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/65">Biến khoảnh khắc thành món quà có thể chạm, nhìn và trải nghiệm bằng công nghệ AR.</p>
          <div className="mt-5 flex gap-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><MessageCircle className="h-4 w-4" /></span><span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Camera className="h-4 w-4" /></span></div>
        </div>
        <div>
          <h3 className="font-semibold">Khám phá</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/65"><Link to="/products">Bộ sưu tập khung</Link><Link to="/design">Thiết kế khung AR</Link><Link to="/orders">Tra cứu đơn hàng</Link><Link to="/register">Tạo tài khoản</Link></div>
        </div>
        <div>
          <h3 className="font-semibold">Chính sách</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/65"><span>Đổi trả trong 7 ngày</span><span>Bảo hành khung 6 tháng</span><span>Bảo mật ảnh cá nhân</span><span>Giao hàng toàn quốc</span></div>
        </div>
        <div>
          <h3 className="font-semibold">Liên hệ</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/65"><p className="flex gap-2"><Phone className="mt-0.5 h-4 w-4" /> 0900 123 456</p><p className="flex gap-2"><Mail className="mt-0.5 h-4 w-4" /> hello@morytory.vn</p><p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4" /> FPT University, Việt Nam</p></div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/45">© 2026 MoryTory · Sản phẩm demo môn EXE201.</div>
    </footer>
  );
}
