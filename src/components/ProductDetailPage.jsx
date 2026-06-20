import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Sparkles, Star, Truck } from 'lucide-react';
import StoreLayout from './layout/StoreLayout';
import ProductCard from './shop/ProductCard';
import { PRODUCTS, formatCurrency, getProductBySlug } from '../data/products';
import { useCartDispatch } from '../store/CartContext';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const navigate = useNavigate();
  const dispatch = useCartDispatch();
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(product?.colors?.[0] || '');

  if (!product) return <StoreLayout><div className="mx-auto max-w-4xl px-4 py-24 text-center"><h1 className="font-serif text-3xl font-bold">Không tìm thấy sản phẩm</h1><Link className="mt-5 inline-block text-brand-wood" to="/products">Quay lại bộ sưu tập</Link></div></StoreLayout>;

  const addToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: { id: crypto.randomUUID(), type: 'catalog', productId: product.id, name: product.name, image: product.image, frameSize: product.size, color, quantity, unitPrice: product.price, pricing: { base: product.price, total: product.price * quantity } } });
    dispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  return (
    <StoreLayout>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-wood"><ArrowLeft className="h-4 w-4" /> Quay lại</button>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] bg-brand-accent-beige"><img src={product.image} alt={product.name} className="aspect-square w-full object-cover" /></div>
          <div className="py-2 lg:py-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent-green">{product.category}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3 text-sm"><span className="flex items-center gap-1 text-amber-600"><Star className="h-4 w-4 fill-current" /> {product.rating}</span><span className="text-gray-400">{product.reviewCount} đánh giá</span></div>
            <p className="mt-6 text-3xl font-bold text-brand-wood">{formatCurrency(product.price)} <span className="ml-2 text-base font-normal text-gray-400 line-through">{formatCurrency(product.compareAtPrice)}</span></p>
            <p className="mt-6 leading-7 text-gray-600">{product.description}</p>

            <div className="mt-7"><p className="mb-3 text-sm font-semibold">Màu khung</p><div className="flex flex-wrap gap-2">{product.colors.map((item) => <button key={item} onClick={() => setColor(item)} className={`rounded-full border px-4 py-2 text-sm ${color === item ? 'border-brand-wood bg-brand-accent-beige text-brand-wood' : 'border-gray-200 bg-white'}`}>{item}</button>)}</div></div>
            <div className="mt-6"><p className="mb-3 text-sm font-semibold">Số lượng</p><div className="inline-flex items-center rounded-full border border-gray-200 bg-white"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3"><Minus className="h-4 w-4" /></button><span className="w-10 text-center font-semibold">{quantity}</span><button onClick={() => setQuantity((value) => Math.min(10, value + 1))} className="p-3"><Plus className="h-4 w-4" /></button></div></div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2"><button onClick={addToCart} className="flex items-center justify-center gap-2 rounded-2xl bg-brand-wood px-6 py-4 font-semibold text-white shadow-lg hover:bg-[#70451f]"><ShoppingBag className="h-5 w-5" /> Thêm vào giỏ</button><Link to="/design" className="flex items-center justify-center gap-2 rounded-2xl border border-brand-wood px-6 py-4 font-semibold text-brand-wood hover:bg-brand-accent-beige"><Sparkles className="h-5 w-5" /> Cá nhân hóa AR</Link></div>

            <div className="mt-8 grid gap-3 rounded-2xl bg-white p-5 text-sm text-gray-600 sm:grid-cols-3"><p className="flex items-center gap-2"><Truck className="h-5 w-5 text-brand-accent-green" /> Giao 2–5 ngày</p><p className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand-accent-green" /> Bảo hành 6 tháng</p><p className="flex items-center gap-2"><Check className="h-5 w-5 text-brand-accent-green" /> Kiểm tra trước nhận</p></div>

            <div className="mt-8"><h2 className="font-serif text-xl font-bold">Điểm nổi bật</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{product.features.map((feature) => <p key={feature} className="flex items-start gap-2 text-sm text-gray-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent-green" /> {feature}</p>)}</div></div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><h2 className="font-serif text-3xl font-bold">Có thể bạn cũng thích</h2><div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{PRODUCTS.filter((item) => item.id !== product.id).slice(0, 3).map((item) => <ProductCard key={item.id} product={item} />)}</div></section>
    </StoreLayout>
  );
}
