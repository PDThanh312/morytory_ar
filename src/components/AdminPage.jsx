import { useEffect, useState } from 'react';
import { ArrowLeft, Banknote, Boxes, Package, RefreshCw, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthActions from './auth/AuthActions';
import { formatCurrency } from '../data/products';

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

const orderStatusOptions = [
  ['pending', 'Chờ xác nhận'], ['confirmed', 'Đã xác nhận'], ['processing', 'Đang chuẩn bị'], ['shipping', 'Đang giao'], ['completed', 'Hoàn thành'], ['cancelled', 'Đã hủy'],
];

export default function AdminPage() {
  const { authFetch, user: currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [changing, setChanging] = useState('');
  const [tab, setTab] = useState('orders');

  const loadDashboard = async () => {
    setLoading(true); setError('');
    try {
      const response = await authFetch('/api/admin/dashboard');
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Không thể tải trang quản trị.');
      setData(payload);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { loadDashboard(); }, []);

  const changeRole = async (email, role) => {
    setChanging(email); setError('');
    try {
      const response = await authFetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, role }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Không thể cập nhật quyền.');
      setData((current) => ({ ...current, summary: { ...current.summary, totalAdmins: current.users.filter((item) => (item.email === email ? role : item.role) === 'admin').length }, users: current.users.map((item) => item.email === email ? payload.user : item) }));
    } catch (err) { setError(err.message); } finally { setChanging(''); }
  };

  const updatePurchase = async (purchaseId, patch) => {
    setChanging(purchaseId); setError('');
    try {
      const response = await authFetch('/api/admin/purchases', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ purchaseId, ...patch }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Không thể cập nhật đơn hàng.');
      setData((current) => ({ ...current, purchases: current.purchases.map((order) => order.purchaseId === purchaseId ? payload.purchase : order) }));
    } catch (err) { setError(err.message); } finally { setChanging(''); }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="sticky top-0 z-40 border-b border-brand-wood/10 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div className="flex items-center gap-3"><Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-gray-100"><ArrowLeft className="h-5 w-5" /></Link><div><h1 className="font-serif text-xl font-bold text-brand-wood sm:text-2xl">MoryTory Admin</h1><p className="text-xs text-gray-500">Quản lý tài khoản, đơn hàng và thanh toán</p></div></div><AuthActions compact /></div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-6 flex justify-end"><button onClick={loadDashboard} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 hover:border-brand-wood disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới</button></div>
        {error && <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">{error}</div>}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Tài khoản', value: data?.summary?.totalUsers ?? '-', icon: Users },
            { label: 'Quản trị viên', value: data?.summary?.totalAdmins ?? '-', icon: ShieldCheck },
            { label: 'Đơn hàng', value: data?.summary?.totalOrders ?? '-', icon: Package },
            { label: 'Doanh thu đã thu', value: data ? formatCurrency(data.summary.paidRevenue) : '-', icon: Banknote },
            { label: 'QR AR đang lưu', value: data?.summary?.activeAR ?? '-', icon: Sparkles },
          ].map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-4 rounded-2xl border border-brand-wood/10 bg-white p-5 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-accent-beige text-brand-wood"><Icon className="h-6 w-6" /></span><div><p className="text-sm text-gray-500">{label}</p><p className="text-xl font-bold">{value}</p></div></div>)}
        </div>

        <div className="mb-5 flex gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-brand-wood/10">
          <button onClick={() => setTab('orders')} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${tab === 'orders' ? 'bg-brand-wood text-white' : 'text-gray-500'}`}><Boxes className="mr-2 inline h-4 w-4" />Đơn hàng</button>
          <button onClick={() => setTab('users')} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${tab === 'users' ? 'bg-brand-wood text-white' : 'text-gray-500'}`}><Users className="mr-2 inline h-4 w-4" />Tài khoản</button>
        </div>

        {tab === 'users' ? (
          <section className="overflow-hidden rounded-2xl border border-brand-wood/10 bg-white shadow-sm"><div className="border-b border-gray-100 px-5 py-4"><h2 className="font-serif text-xl font-bold">Danh sách tài khoản</h2></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Người dùng</th><th className="px-5 py-3">Vai trò</th><th className="px-5 py-3">Phân quyền</th><th className="px-5 py-3">Ngày tạo</th></tr></thead><tbody className="divide-y divide-gray-100">{(data?.users || []).map((user) => <tr key={user.id}><td className="px-5 py-4"><p className="font-medium">{user.name}</p><p className="text-gray-500">{user.email}</p></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span></td><td className="px-5 py-4"><select value={user.role} disabled={changing === user.email || currentUser?.email === user.email} onChange={(event) => changeRole(user.email, event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 disabled:opacity-50"><option value="user">user</option><option value="admin">admin</option></select></td><td className="px-5 py-4 text-gray-500">{formatDate(user.createdAt)}</td></tr>)}</tbody></table></div></section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-brand-wood/10 bg-white shadow-sm"><div className="border-b border-gray-100 px-5 py-4"><h2 className="font-serif text-xl font-bold">Đơn hàng gần đây</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-sm"><thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Mã đơn</th><th className="px-5 py-3">Khách hàng</th><th className="px-5 py-3">Sản phẩm</th><th className="px-5 py-3">Thanh toán</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Tổng tiền</th></tr></thead><tbody className="divide-y divide-gray-100">{(data?.purchases || []).map((order) => <tr key={order.purchaseId}><td className="px-5 py-4"><p className="font-mono font-semibold">#{order.purchaseId}</p><p className="mt-1 text-xs text-gray-400">{formatDate(order.createdAt)}</p></td><td className="px-5 py-4"><p className="font-medium">{order.customer?.name}</p><p className="text-gray-500">{order.customer?.phone}</p><p className="max-w-xs truncate text-xs text-gray-400">{order.customer?.address}</p></td><td className="px-5 py-4"><p>{order.items?.length || 0} sản phẩm</p><p className="max-w-xs truncate text-xs text-gray-500">{order.items?.map((item) => item.name).join(', ')}</p></td><td className="px-5 py-4"><select value={order.payment?.status || 'unpaid'} disabled={changing === order.purchaseId} onChange={(event) => updatePurchase(order.purchaseId, { paymentStatus: event.target.value })} className="rounded-lg border border-gray-200 px-2 py-2 text-xs"><option value="unpaid">Chưa thanh toán</option><option value="pending">Chờ đối soát</option><option value="paid">Đã thanh toán</option><option value="refunded">Đã hoàn tiền</option></select><p className="mt-1 text-xs text-gray-400">{order.payment?.method}</p></td><td className="px-5 py-4"><select value={order.status || 'pending'} disabled={changing === order.purchaseId} onChange={(event) => updatePurchase(order.purchaseId, { status: event.target.value })} className="rounded-lg border border-gray-200 px-2 py-2 text-xs">{orderStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td><td className="px-5 py-4 font-bold text-brand-wood">{formatCurrency(order.total)}</td></tr>)}{!loading && !data?.purchases?.length && <tr><td colSpan="6" className="px-5 py-10 text-center text-gray-500">Chưa có đơn hàng.</td></tr>}</tbody></table></div></section>
        )}
      </main>
    </div>
  );
}
