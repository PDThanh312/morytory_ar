import { LogIn, LogOut, ShieldCheck, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function AuthActions({ compact = false }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="h-10 w-28 rounded-full bg-black/5 animate-pulse" />;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-wood/30 text-brand-wood font-medium hover:bg-brand-accent-beige transition-colors"
        >
          <LogIn className="w-4 h-4" />
          {!compact && <span className="hidden sm:inline">Đăng nhập</span>}
        </Link>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-wood text-white font-medium hover:bg-brand-wood/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          {!compact && <span className="hidden sm:inline">Tạo tài khoản</span>}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-100 text-amber-800 font-medium hover:bg-amber-200 transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
          {!compact && 'Quản trị'}
        </button>
      )}
      {!compact && (
        <div className="hidden lg:block text-right leading-tight px-2">
          <p className="text-sm font-semibold text-brand-text">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
        </div>
      )}
      <button
        onClick={logout}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors"
        title="Đăng xuất"
      >
        <LogOut className="w-4 h-4" />
        {!compact && <span className="hidden sm:inline">Đăng xuất</span>}
      </button>
    </div>
  );
}
