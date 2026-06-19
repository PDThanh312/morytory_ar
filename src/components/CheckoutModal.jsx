import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle } from 'lucide-react';
import { resizeImageForAR } from '../utils/imageUtils';
import { useCartDispatch } from '../store/CartContext';
import { useAuth } from '../auth/AuthContext';

export default function CheckoutModal({ isOpen, onClose, cartItems }) {
  const { user, authFetch } = useAuth();
  const [step, setStep] = useState(1);
  const [orderIds, setOrderIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customer, setCustomer] = useState({ name: user?.name || '', phone: '', address: '' });
  const dispatch = useCartDispatch();

  if (!isOpen) return null;

  const handleCheckout = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      const results = await Promise.all(cartItems.map(async (item) => {
        const compressedImage = await resizeImageForAR(item.photoPreviewUrl);
        const response = await authFetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetImage: compressedImage,
            effect: item.selectedAREffect || null,
            overlayText: item.overlay?.text || '',
            overlayFont: item.overlay?.fontStyle || 'serif',
            overlayFontSize: item.overlay?.fontSize || 16,
            frameSize: item.frameSize,
            price: item.pricing?.total || 0,
            customer,
          }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || 'Không thể lưu đơn hàng vào server.');

        return {
          id: payload.orderId,
          frameSize: item.frameSize,
          previewUrl: item.photoPreviewUrl,
        };
      }));

      setOrderIds(results);
      dispatch({ type: 'CLEAR_CART' });
      setStep(2);
    } catch (error) {
      alert(error.message || 'Lỗi khi xử lý đơn hàng. Hãy thử lại!');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 z-10">
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <div className="p-6 overflow-y-auto">
            <h2 className="text-2xl font-serif font-bold text-brand-text mb-1">Thông tin giao hàng</h2>
            <p className="text-sm text-gray-500 mb-6">Đơn hàng sẽ được gắn với tài khoản {user?.email}</p>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                <input required type="text" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-wood focus:border-transparent outline-none" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input required type="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-wood focus:border-transparent outline-none" placeholder="090..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận khung tranh</label>
                <textarea required rows="3" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-wood focus:border-transparent outline-none" placeholder="Số nhà, tên đường..."></textarea>
              </div>
              <button disabled={isProcessing} type="submit" className="w-full bg-brand-wood text-white py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-lg mt-6 disabled:opacity-50">
                {isProcessing ? 'Đang xử lý...' : `Xác nhận đặt hàng (${cartItems.length} sản phẩm)`}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center overflow-y-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500 shrink-0">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-text mb-2 text-center">Đặt hàng thành công!</h2>
            <p className="text-gray-500 mb-6 text-center">Dưới đây là các mã QR tương ứng với từng khung ảnh của bạn</p>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {orderIds.map((order) => (
                <div key={order.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                  <div className="flex items-center gap-3 w-full mb-3">
                    <img src={order.previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded-md" />
                    <div>
                      <p className="text-xs font-semibold">Mã: #{order.id}</p>
                      <p className="text-xs text-gray-500">Khung {order.frameSize} cm</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 inline-block">
                    <QRCodeSVG value={`${window.location.origin}/ar?orderId=${order.id}`} size={120} level="H" includeMargin />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-center">QR này sẽ được in sau khung</p>
                </div>
              ))}
            </div>

            <button onClick={onClose} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all shrink-0">Đóng</button>
          </div>
        )}
      </div>
    </div>
  );
}
