import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import StoreLayout from './layout/StoreLayout';
import ProductCard from './shop/ProductCard';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/products';

export default function ProductsPage() {
  const [category, setCategory] = useState('Tất cả');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');

  const products = useMemo(() => {
    const filtered = PRODUCTS.filter((product) => (category === 'Tất cả' || product.category === category) && product.name.toLowerCase().includes(query.trim().toLowerCase()));
    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return Number(Boolean(b.includesAR)) - Number(Boolean(a.includesAR));
    });
  }, [category, query, sort]);

  return (
    <StoreLayout>
      <section className="border-b border-brand-wood/10 bg-gradient-to-br from-[#fffaf2] to-[#efe3d2]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent-green">Bộ sưu tập 2026</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">Khung ảnh cho mọi câu chuyện đáng nhớ</h1>
          <p className="mt-4 max-w-2xl text-gray-600">Chọn mẫu có sẵn hoặc bắt đầu thiết kế riêng với ảnh, lời nhắn và hiệu ứng AR của bạn.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 rounded-2xl border border-brand-wood/10 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto_auto]">
          <label className="relative block"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm khung ảnh..." className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-brand-wood" /></label>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === item ? 'bg-brand-wood text-white' : 'bg-brand-bg text-gray-600 hover:text-brand-wood'}`}>{item}</button>)}
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-3"><SlidersHorizontal className="h-4 w-4 text-gray-400" /><select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent py-3 text-sm outline-none"><option value="featured">Nổi bật</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="rating">Đánh giá cao</option></select></label>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {!products.length && <div className="py-20 text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>}
      </section>
    </StoreLayout>
  );
}
