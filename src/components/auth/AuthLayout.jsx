import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-brand-bg px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-3xl font-serif font-bold text-brand-wood tracking-wide mb-8">
          MoryTory
        </Link>
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-wood/10 border border-brand-wood/10 p-7 sm:p-9">
          <h1 className="text-3xl font-serif font-bold text-brand-text text-center">{title}</h1>
          <p className="text-gray-500 text-center mt-2 mb-7">{subtitle}</p>
          {children}
          <div className="mt-7 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
