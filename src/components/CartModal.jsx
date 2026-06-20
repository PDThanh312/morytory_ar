import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart, useCartDispatch } from '../store/CartContext';
import CheckoutModal from './CheckoutModal';
import { formatCurrency } from '../data/products';

function itemPrice(item) {
  return Number(item.unitPrice ?? item.pricing?.total ?? 0) * Number(item.quantity || 1);
}

export default function CartModal() {
  const { isOpen, items } = useCart();
  const dispatch = useCartDispatch();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen && !isCheckoutOpen) return null;
  const totalAmount = items.reduce((sum, item) => sum + itemPrice(item), 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/45 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && dispatch({ type: 'SET_CART_OPEN', payload: false })}>
          <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-5"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent-green">MoryTory</p><h2 className="font-serif text-2xl font-bold">Giỏ hàng ({items.length})</h2></div><button onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })} className="grid h-10 w-10 place-items-center rounded-full bg-gray-100"><X className="h-5 w-5" /></button></div>
            <div className="flex-1 overflow-y-auto p-5">
              {!items.length ? (
                <div className="grid h-full place-items-center text-center"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-accent-beige text-brand-wood"><ShoppingBag className="h-7 w-7" /></span><h3 className="mt-4 font-serif text-xl font-bold">Giỏ hàng đang trống</h3><p className="mt-2 text-sm text-gray-500">Hãy chọn một mẫu khung hoặc tạo thiết kế riêng.</p><button onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })} className="mt-5 font-semibold text-brand-wood">Tiếp tục mua sắm</button></div></div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <article key={item.id} className="flex gap-4 rounded-2xl border border-gray-100 bg-brand-bg p-3">
                      <img src={item.photoPreviewUrl || item.image || '/products/classic-oak.svg'} alt={item.name || 'Khung ảnh cá nhân hóa'} className="h-24 w-24 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2"><div><h3 className="truncate font-semibold">{item.name || `Khung cá nhân hóa ${item.frameSize}`}</h3><p className="mt-1 text-xs text-gray-500">{item.color || `Kích thước ${item.frameSize} cm`}{item.selectedAREffect ? ` · AR ${item.selectedAREffect}` : ''}</p></div><button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></div>
                        <div className="mt-4 flex items-center justify-between"><span className="font-bold text-brand-wood">{formatCurrency(itemPrice(item))}</span>{item.type === 'catalog' ? <div className="flex items-center rounded-full border border-gray-200 bg-white"><button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: Number(item.quantity || 1) - 1 } })} className="p-2"><Minus className="h-3 w-3" /></button><span className="w-7 text-center text-xs font-semibold">{item.quantity || 1}</span><button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: Number(item.quantity || 1) + 1 } })} className="p-2"><Plus className="h-3 w-3" /></button></div> : <span className="text-xs text-gray-400">SL 1</span>}</div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
            {!!items.length && <div className="border-t border-gray-100 bg-white p-5"><div className="mb-4 flex items-center justify-between"><span className="text-gray-500">Tạm tính</span><span className="text-2xl font-bold">{formatCurrency(totalAmount)}</span></div><p className="mb-4 text-xs text-gray-400">Phí vận chuyển được tính ở bước thanh toán.</p><button onClick={() => { setIsCheckoutOpen(true); dispatch({ type: 'SET_CART_OPEN', payload: false }); }} className="w-full rounded-2xl bg-brand-accent-green py-4 font-semibold text-white shadow-lg hover:bg-[#768e4e]">Tiến hành thanh toán</button></div>}
          </aside>
        </div>
      )}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={items} />
    </>
  );
}
