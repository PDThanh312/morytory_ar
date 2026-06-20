import { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Banknote, CheckCircle2, CreditCard, Landmark, LockKeyhole, X } from 'lucide-react';
import { resizeImageForAR } from '../utils/imageUtils';
import { useCartDispatch } from '../store/CartContext';
import { useAuth } from '../auth/AuthContext';
import { formatCurrency } from '../data/products';
import { useNavigate } from 'react-router-dom';

const PAYMENT_OPTIONS = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng', description: 'Thanh toán bằng tiền mặt khi đơn được giao', icon: Banknote },
  { id: 'bank_transfer', label: 'Chuyển khoản ngân hàng', description: 'Nhận nội dung và mã QR chuyển khoản sau khi đặt', icon: Landmark },
  { id: 'demo_gateway', label: 'Cổng thanh toán demo', description: 'Mô phỏng giao dịch thành công cho buổi thuyết trình', icon: CreditCard, demo: true },
];

function itemUnitPrice(item) {
  return Number(item.unitPrice ?? item.pricing?.total ?? 0);
}

export default function CheckoutModal({ isOpen, onClose, cartItems }) {
  const { user, authFetch, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useCartDispatch();
  const [step, setStep] = useState('form');
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [customer, setCustomer] = useState({ name: user?.name || '', phone: '', email: user?.email || '', address: '', note: '' });

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + itemUnitPrice(item) * Number(item.quantity || 1), 0), [cartItems]);
  const shippingFee = subtotal >= 300000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  if (!isOpen) return null;

  const closeModal = () => {
    if (!isProcessing) {
      onClose();
      if (step === 'success') {
        setStep('form');
        setResult(null);
      }
    }
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setError('');
    if (!isAuthenticated) {
      onClose();
      navigate('/login?redirect=/products');
      return;
    }

    setIsProcessing(true);
    try {
      const items = await Promise.all(cartItems.map(async (item) => {
        const targetImage = item.type === 'custom' && item.photoPreviewUrl ? await resizeImageForAR(item.photoPreviewUrl) : null;
        return {
          id: item.id,
          type: item.type || 'catalog',
          productId: item.productId,
          name: item.name || `Khung ảnh cá nhân hóa ${item.frameSize}`,
          image: item.image,
          frameSize: item.frameSize,
          color: item.color,
          quantity: Number(item.quantity || 1),
          unitPrice: itemUnitPrice(item),
          effect: item.selectedAREffect || null,
          overlayText: item.overlay?.text || '',
          overlayFont: item.overlay?.fontStyle || 'serif',
          overlayFontSize: item.overlay?.fontSize || 16,
          targetImage,
        };
      }));

      const response = await authFetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, paymentMethod, items }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Không thể tạo đơn hàng.');
      setResult(payload);
      dispatch({ type: 'CLEAR_CART' });
      setStep('success');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-3 backdrop-blur-sm sm:p-6">
      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
        <button onClick={closeModal} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gray-500 shadow"><X className="h-5 w-5" /></button>

        {step === 'form' ? (
          <form onSubmit={handleCheckout} className="grid lg:grid-cols-[1.1fr_.9fr]">
            <div className="p-6 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent-green">Checkout</p>
              <h2 className="mt-2 font-serif text-3xl font-bold">Thông tin nhận hàng</h2>
              <p className="mt-2 text-sm text-gray-500">Đơn hàng sẽ được lưu vào tài khoản {user?.email || 'của bạn'}.</p>
              {error && <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium">Họ và tên<input required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-brand-wood" placeholder="Nguyễn Văn A" /></label>
                <label className="grid gap-1.5 text-sm font-medium">Số điện thoại<input required type="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-brand-wood" placeholder="0901234567" /></label>
                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">Email<input type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-brand-wood" /></label>
                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">Địa chỉ giao hàng<textarea required rows="3" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} className="resize-none rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-brand-wood" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" /></label>
                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">Ghi chú<textarea rows="2" value={customer.note} onChange={(event) => setCustomer({ ...customer, note: event.target.value })} className="resize-none rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-brand-wood" placeholder="Lời nhắn cho cửa hàng hoặc đơn vị vận chuyển" /></label>
              </div>

              <h3 className="mt-8 font-serif text-xl font-bold">Phương thức thanh toán</h3>
              <div className="mt-4 grid gap-3">
                {PAYMENT_OPTIONS.map(({ id, label, description, icon: Icon, demo }) => (
                  <button type="button" key={id} onClick={() => setPaymentMethod(id)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${paymentMethod === id ? 'border-brand-wood bg-brand-accent-beige/70' : 'border-gray-200 hover:border-brand-wood/40'}`}>
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${paymentMethod === id ? 'bg-brand-wood text-white' : 'bg-gray-100 text-gray-500'}`}><Icon className="h-5 w-5" /></span>
                    <span className="flex-1"><span className="flex items-center gap-2 font-semibold">{label}{demo && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] uppercase text-amber-700">Demo</span>}</span><span className="mt-1 block text-xs text-gray-500">{description}</span></span>
                    <span className={`h-5 w-5 rounded-full border-2 ${paymentMethod === id ? 'border-[6px] border-brand-wood' : 'border-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <aside className="bg-[#f7f2ea] p-6 sm:p-9">
              <h3 className="font-serif text-2xl font-bold">Tóm tắt đơn hàng</h3>
              <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
                {cartItems.map((item) => <div key={item.id} className="flex gap-3"><img src={item.photoPreviewUrl || item.image || '/products/classic-oak.svg'} alt="" className="h-16 w-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name || `Khung cá nhân hóa ${item.frameSize}`}</p><p className="mt-1 text-xs text-gray-500">SL {item.quantity || 1}{item.color ? ` · ${item.color}` : ''}</p></div><p className="text-sm font-semibold">{formatCurrency(itemUnitPrice(item) * Number(item.quantity || 1))}</p></div>)}
              </div>
              <div className="mt-6 space-y-3 border-t border-brand-wood/10 pt-5 text-sm"><div className="flex justify-between text-gray-600"><span>Tạm tính</span><span>{formatCurrency(subtotal)}</span></div><div className="flex justify-between text-gray-600"><span>Phí vận chuyển</span><span>{shippingFee ? formatCurrency(shippingFee) : 'Miễn phí'}</span></div><div className="flex justify-between border-t border-brand-wood/10 pt-4 text-lg font-bold"><span>Tổng cộng</span><span className="text-brand-wood">{formatCurrency(total)}</span></div></div>
              <button disabled={isProcessing || !cartItems.length} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-accent-green py-4 font-semibold text-white shadow-lg disabled:opacity-60"><LockKeyhole className="h-4 w-4" /> {isProcessing ? 'Đang xử lý...' : paymentMethod === 'demo_gateway' ? 'Thanh toán demo' : 'Xác nhận đặt hàng'}</button>
              <p className="mt-4 text-center text-xs leading-5 text-gray-400">Bằng việc đặt hàng, bạn đồng ý với chính sách mua hàng và bảo mật dữ liệu của MoryTory.</p>
            </aside>
          </form>
        ) : (
          <div className="p-7 text-center sm:p-12">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-600"><CheckCircle2 className="h-10 w-10" /></span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent-green">Đặt hàng thành công</p>
            <h2 className="mt-2 font-serif text-4xl font-bold">Cảm ơn bạn đã chọn MoryTory</h2>
            <p className="mt-3 text-gray-500">Mã đơn của bạn: <strong className="font-mono text-brand-wood">#{result?.purchaseId}</strong></p>

            {result?.payment?.method === 'bank_transfer' && (
              <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-brand-wood/15 bg-brand-bg p-6 text-left sm:flex sm:items-center sm:gap-6">
                <div className="mx-auto w-fit rounded-2xl bg-white p-3 sm:mx-0"><QRCodeSVG value={`BANK:${result.payment.bankName}|ACC:${result.payment.bankAccount}|AMOUNT:${result.totals.total}|CONTENT:${result.payment.transferCode}`} size={150} /></div>
                <div className="mt-5 text-sm sm:mt-0"><p className="font-serif text-xl font-bold">Thông tin chuyển khoản</p><p className="mt-3">Ngân hàng: <strong>{result.payment.bankName}</strong></p><p>Số tài khoản: <strong>{result.payment.bankAccount}</strong></p><p>Chủ tài khoản: <strong>{result.payment.bankOwner}</strong></p><p>Số tiền: <strong className="text-brand-wood">{formatCurrency(result.totals.total)}</strong></p><p>Nội dung: <strong>{result.payment.transferCode}</strong></p></div>
              </div>
            )}

            {!!result?.arOrders?.length && <div className="mx-auto mt-8 max-w-3xl"><h3 className="font-serif text-xl font-bold">Mã QR trải nghiệm AR</h3><p className="mt-2 text-sm text-gray-500">Mỗi thiết kế cá nhân hóa có một QR riêng. Đây là bản xem trước để demo.</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{result.arOrders.map((order) => <div key={order.orderId} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><QRCodeSVG value={`${window.location.origin}/ar?orderId=${order.orderId}`} size={140} className="mx-auto" /><p className="mt-3 text-sm font-semibold">{order.name}</p><p className="mt-1 font-mono text-xs text-gray-400">{order.orderId}</p></div>)}</div></div>}

            {result?.payment?.method === 'demo_gateway' && <p className="mx-auto mt-7 max-w-xl rounded-xl bg-amber-50 p-3 text-sm text-amber-700">Giao dịch đã được đánh dấu <strong>paid</strong> bằng cổng thanh toán mô phỏng. Không có tiền thật được thu.</p>}
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => { closeModal(); navigate('/orders'); }} className="rounded-full bg-brand-wood px-7 py-3 font-semibold text-white">Xem đơn hàng</button><button onClick={closeModal} className="rounded-full border border-brand-wood px-7 py-3 font-semibold text-brand-wood">Tiếp tục mua sắm</button></div>
          </div>
        )}
      </div>
    </div>
  );
}
