import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { RequireAuth } from './components/layout/RequireAuth';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmPage } from './pages/OrderConfirmPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <RequireAuth><CheckoutPage /></RequireAuth> },
      { path: 'order-confirm/:orderId', element: <RequireAuth><OrderConfirmPage /></RequireAuth> },
      { path: 'orders', element: <RequireAuth><OrdersPage /></RequireAuth> },
      { path: 'profile', element: <RequireAuth><ProfilePage /></RequireAuth> },
      { path: 'favorites', element: <RequireAuth><FavoritesPage /></RequireAuth> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'search', element: <SearchPage /> },
    ]
  }
]);
