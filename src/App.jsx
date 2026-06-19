import { Route, Routes, useLocation } from 'react-router-dom';
import { DesignProvider } from './store/DesignContext';
import { CartProvider } from './store/CartContext';
import ProtectedRoute from './auth/ProtectedRoute';
import HomePage from './components/HomePage';
import DesignPage from './components/DesignPage';
import ARRoute from './components/ARRoute';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminPage from './components/AdminPage';
import CartIcon from './components/CartIcon';
import CartModal from './components/CartModal';

function StoreChrome() {
  const { pathname } = useLocation();
  const hidden = pathname === '/ar' || pathname === '/login' || pathname === '/register' || pathname.startsWith('/admin');
  if (hidden) return null;
  return <><CartIcon /><CartModal /></>;
}

function App() {
  return (
    <CartProvider>
      <DesignProvider>
        <StoreChrome />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/design"
            element={
              <ProtectedRoute>
                <DesignPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/ar" element={<ARRoute />} />
        </Routes>
      </DesignProvider>
    </CartProvider>
  );
}

export default App;
