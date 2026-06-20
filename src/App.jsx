import { Route, Routes, useLocation } from 'react-router-dom';
import { DesignProvider } from './store/DesignContext';
import { CartProvider } from './store/CartContext';
import ProtectedRoute from './auth/ProtectedRoute';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import DesignPage from './components/DesignPage';
import OrdersPage from './components/OrdersPage';
import ARRoute from './components/ARRoute';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminPage from './components/AdminPage';
import CartModal from './components/CartModal';
import AIChatbot from './components/chat/AIChatbot';

function GlobalChrome() {
  const { pathname } = useLocation();
  if (pathname === '/ar' || pathname.startsWith('/admin')) return null;
  const hideChat = pathname === '/login' || pathname === '/register';
  return <><CartModal />{!hideChat && <AIChatbot />}</>;
}

function App() {
  return (
    <CartProvider>
      <DesignProvider>
        <GlobalChrome />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/design" element={<ProtectedRoute><DesignPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />
          <Route path="/ar" element={<ARRoute />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </DesignProvider>
    </CartProvider>
  );
}

export default App;
