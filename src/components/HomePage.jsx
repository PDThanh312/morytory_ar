import { useNavigate } from 'react-router-dom';
import AuthActions from './auth/AuthActions';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text font-sans">
      <header className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-wood/20 px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm gap-4">
        <div className="text-2xl font-serif font-bold text-brand-wood tracking-wide">
          MoryTory
        </div>
        <AuthActions />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-text leading-tight">
            Lưu Giữ Kỷ Niệm Của Bạn Với <span className="text-brand-wood italic">Khung Ảnh Gỗ 3D</span> Tích Hợp AR
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Chế tác khung ảnh gỗ mộc mạc, cao cấp kết hợp hiệu ứng sống động. Quét để tái hiện những khoảnh khắc tuyệt vời nhất.
          </p>

          <div className="pt-8">
            <button
              onClick={() => navigate('/design')}
              className="px-8 py-4 bg-brand-accent-green text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-[#7a9352] transition-all duration-300 ease-in-out inline-flex items-center gap-2"
            >
              Bắt Đầu Thiết Kế Khung Ảnh
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
