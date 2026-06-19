import { useEffect, useState } from 'react';
import { ArrowLeft, Package, RefreshCw, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthActions from './auth/AuthActions';

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

export default function AdminPage() {
  const { authFetch, user: currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [changingUser, setChangingUser] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authFetch('/api/admin/dashboard');
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Không thể tải trang quản trị.');
      setData(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const changeRole = async (email, role) => {
    setChangingUser(email);
    setError('');
    try {
      const response = await authFetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Không thể cập nhật quyền.');
      setData((current) => ({
        ...current,
        summary: {
          ...current.summary,
          totalAdmins: current.users.filter((item) => (item.email === email ? role : item.role) === 'admin').length,
        },
        users: current.users.map((item) => item.email === email ? payload.user : item),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setChangingUser('');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-brand-wood/10 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-brand-wood">Quản trị MoryTory</h1>
            <p className="text-xs text-gray-500">Chỉ tài khoản admin mới truy cập được</p>
          </div>
        </div>
        <AuthActions compact />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex justify-end mb-5">
          <button onClick={loadDashboard} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-brand-wood disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới
          </button>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700">{error}</div>}

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Tổng tài khoản', value: data?.summary?.totalUsers ?? '-', icon: Users },
            { label: 'Quản trị viên', value: data?.summary?.totalAdmins ?? '-', icon: ShieldCheck },
            { label: 'Tổng đơn hàng', value: data?.summary?.totalOrders ?? '-', icon: Package },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-brand-wood/10 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-accent-beige flex items-center justify-center text-brand-wood"><Icon className="w-6 h-6" /></div>
              <div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold">{value}</p></div>
            </div>
          ))}
        </div>

        <section className="bg-white rounded-2xl border border-brand-wood/10 shadow-sm overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-serif font-bold text-xl">Tài khoản</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Người dùng</th><th className="px-5 py-3">Vai trò</th><th className="px-5 py-3">Phân quyền</th><th className="px-5 py-3">Ngày tạo</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {(data?.users || []).map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4"><p className="font-medium">{user.name}</p><p className="text-gray-500">{user.email}</p></td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span></td>
                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={changingUser === user.email || currentUser?.email === user.email}
                        onChange={(event) => changeRole(user.email, event.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
                        aria-label={`Phân quyền cho ${user.email}`}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
                {!loading && !data?.users?.length && <tr><td colSpan="4" className="px-5 py-8 text-center text-gray-500">Chưa có tài khoản.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-brand-wood/10 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-serif font-bold text-xl">Đơn hàng gần đây</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Mã đơn</th><th className="px-5 py-3">Khách hàng</th><th className="px-5 py-3">Sản phẩm</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Ngày tạo</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {(data?.orders || []).map((order) => (
                  <tr key={order.orderId}>
                    <td className="px-5 py-4 font-mono font-semibold">#{order.orderId}</td>
                    <td className="px-5 py-4"><p className="font-medium">{order.customer?.name || order.userEmail}</p><p className="text-gray-500">{order.customer?.phone || order.userEmail}</p><p className="max-w-xs truncate text-gray-400">{order.customer?.address}</p></td>
                    <td className="px-5 py-4"><p>Khung {order.frameSize || '-'}</p><p className="text-brand-wood font-medium">{Number(order.price || 0).toLocaleString('vi-VN')}đ</p></td>
                    <td className="px-5 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{order.status || 'pending'}</span></td>
                    <td className="px-5 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
                {!loading && !data?.orders?.length && <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-500">Chưa có đơn hàng.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
