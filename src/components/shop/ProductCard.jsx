import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';
import { formatCurrency } from '../../data/products';
import { useCartDispatch } from '../../store/CartContext';

export default function ProductCard({ product }) {
  const dispatch = useCartDispatch();
  const navigate = useNavigate();

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: crypto.randomUUID(),
        type: 'catalog',
        productId: product.id,
        name: product.name,
        image: product.image,
        frameSize: product.size,
        unitPrice: product.price,
        quantity: 1,
        pricing: { base: product.price, total: product.price },
      },
    });
    dispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  return (
    <article className="group overflow-hidden rounded-[28px] border border-brand-wood/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden bg-brand-accent-beige">
        <img src={product.image} alt={product.name} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
        {product.badge && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-wood shadow-sm">{product.badge}</span>}
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-accent-green">{product.category}</p>
            <Link to={`/products/${product.slug}`} className="mt-1 block font-serif text-xl font-bold text-brand-text hover:text-brand-wood">{product.name}</Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-600"><Star className="h-4 w-4 fill-current" /> {product.rating}</div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">{product.description}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div><p className="text-xl font-bold text-brand-wood">{formatCurrency(product.price)}</p><p className="text-xs text-gray-400 line-through">{formatCurrency(product.compareAtPrice)}</p></div>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/products/${product.slug}`)} className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-wood hover:text-brand-wood" aria-label={`Xem ${product.name}`}><ArrowRight className="h-4 w-4" /></button>
            <button onClick={addToCart} className="grid h-10 w-10 place-items-center rounded-full bg-brand-wood text-white transition hover:bg-[#73471f]" aria-label={`Thêm ${product.name} vào giỏ`}><ShoppingBag className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
