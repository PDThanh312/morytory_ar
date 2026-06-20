import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function StoreLayout({ children, footer = true }) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <SiteHeader />
      <main>{children}</main>
      {footer && <SiteFooter />}
    </div>
  );
}
