import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, CalendarDays, CreditCard, PackageCheck, RefreshCw, Truck } from 'lucide-react';
import StoreLayout from './layout/StoreLayout';
import { useAuth } from '../auth/AuthContext';
import { formatCurrency } from '../data/products';

const STATUS_LABELS = {
  pending: ['Chờ xác nhận', 'bg-amber-100 text-amber-800'],
  confirmed: ['Đã xác nhận', 'bg-blue-100 text-blue-800'],
  processing: ['Đang chuẩn bị', 'bg-violet-100 text-violet-800'],
  shipping: ['Đang giao', 'bg-cyan-100 text-cyan-800'],
  completed: ['Hoàn thành', 'bg-green-100 text-green-800'],
  cancelled: ['Đã hủy', 'bg-red-100 text-red-800'],
};

function formatDate(value) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function OrdersPage() {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authFetch('/api/my-orders');
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Không thể tải đơn hàng.');
      setOrders(payload.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  return (
    <StoreLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-green">Tài khoản của bạn</p><h1 className="mt-2 font-serif text-4xl font-bold">Đơn hàng đã đặt</h1><p className="mt-3 text-gray-500">Theo dõi trạng thái thanh toán, sản xuất và giao hàng.</p></div><button onClick={loadOrders} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-wood/20 bg-white px-5 py-3 text-sm font-semibold text-brand-wood"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới</button></div>
        {error && <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">{error}</div>}

        <div className="mt-8 space-y-5">
          {!loading && !orders.length && <div className="rounded-[28px] border border-brand-wood/10 bg-white p-12 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-accent-beige text-brand-wood"><Box className="h-7 w-7" /></span><h2 className="mt-4 font-serif text-2xl font-bold">Bạn chưa có đơn hàng</h2><p className="mt-2 text-gray-500">Khám phá bộ sưu tập hoặc tạo một khung AR đầu tiên.</p><Link to="/products" className="mt-6 inline-flex rounded-full bg-brand-wood px-6 py-3 font-semibold text-white">Mua sắm ngay</Link></div>}
          {orders.map((order) => {
            const [statusLabel, statusClass] = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            return (
              <article key={order.purchaseId} className="overflow-hidden rounded-[28px] border border-brand-wood/10 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 bg-brand-bg px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-sm font-bold text-brand-wood">#{order.purchaseId}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(order.createdAt)}</p></div><div className="flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{statusLabel}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.payment?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{order.payment?.status === 'paid' ? 'Đã thanh toán' : order.payment?.method === 'cod' ? 'Thanh toán khi nhận' : 'Chờ thanh toán'}</span></div></div>
                <div className="p-5">
                  <div className="space-y-4">{(order.items || []).map((item) => <div key={item.id} className="flex items-center gap-4"><img src={item.image || '/products/ar-story.svg'} alt="" className="h-16 w-16 rounded-xl bg-brand-accent-beige object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-semibold">{item.name}</p><p className="mt-1 text-xs text-gray-500">{item.frameSize ? `${item.frameSize} cm` : ''}{item.color ? ` · ${item.color}` : ''} · SL {item.quantity}</p>{item.arOrderId && <Link className="mt-1 inline-block text-xs font-semibold text-brand-accent-green" to={`/ar?orderId=${item.arOrderId}`}>Mở trải nghiệm AR</Link>}</div><p className="text-sm font-semibold">{formatCurrency(item.lineTotal)}</p></div>)}</div>
                  <div className="mt-5 grid gap-3 border-t border-gray-100 pt-5 text-sm sm:grid-cols-3"><p className="flex items-center gap-2 text-gray-600"><CreditCard className="h-4 w-4 text-brand-wood" /> {order.payment?.method === 'cod' ? 'COD' : order.payment?.method === 'bank_transfer' ? 'Chuyển khoản' : 'Thanh toán demo'}</p><p className="flex items-center gap-2 text-gray-600"><Truck className="h-4 w-4 text-brand-wood" /> {order.customer?.address}</p><p className="text-right text-lg font-bold text-brand-wood">{formatCurrency(order.total)}</p></div>
                </div>
              </article>
            );
          })}
          {loading && <div className="py-20 text-center text-gray-500"><PackageCheck className="mx-auto mb-3 h-8 w-8 animate-pulse" /> Đang tải đơn hàng...</div>}
        </div>
      </section>
    </StoreLayout>
  );
}
