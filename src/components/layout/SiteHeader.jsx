import { Link, NavLink } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { useCart, useCartDispatch } from '../../store/CartContext';
import AuthActions from '../auth/AuthActions';

const links = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/products', label: 'Sản phẩm' },
  { to: '/design', label: 'Thiết kế AR' },
  { to: '/orders', label: 'Đơn hàng' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { items } = useCart();
  const dispatch = useCartDispatch();
  const count = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-wood/10 bg-[#fffdf9]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="MoryTory trang chủ">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-wood text-lg font-bold text-white shadow-sm">M</span>
          <span>
            <span className="block font-serif text-xl font-bold leading-none text-brand-wood">MoryTory</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Keep your story</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-accent-beige text-brand-wood' : 'text-gray-600 hover:bg-white hover:text-brand-wood'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: true })}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-brand-wood/15 bg-white text-brand-wood transition hover:border-brand-wood/40"
            aria-label="Mở giỏ hàng"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{count}</span>}
          </button>
          <div className="hidden sm:block"><AuthActions compact /></div>
          <button onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white lg:hidden" aria-label="Mở menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)} className={({ isActive }) => `rounded-xl px-4 py-3 font-medium ${isActive ? 'bg-brand-accent-beige text-brand-wood' : 'text-gray-700'}`}>
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-gray-100 pt-3 sm:hidden"><AuthActions /></div>
          </nav>
        </div>
      )}
    </header>
  );
}
