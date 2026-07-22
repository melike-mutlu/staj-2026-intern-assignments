import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { RequireAuth } from './components/layout/RequireAuth';

const pages = {
  Home: lazy(() => import('./pages/HomePage').then(({ HomePage }) => ({ default: HomePage }))),
  ProductDetail: lazy(() => import('./pages/ProductDetailPage').then(({ ProductDetailPage }) => ({ default: ProductDetailPage }))),
  Cart: lazy(() => import('./pages/CartPage').then(({ CartPage }) => ({ default: CartPage }))),
  Checkout: lazy(() => import('./pages/CheckoutPage').then(({ CheckoutPage }) => ({ default: CheckoutPage }))),
  OrderConfirm: lazy(() => import('./pages/OrderConfirmPage').then(({ OrderConfirmPage }) => ({ default: OrderConfirmPage }))),
  Orders: lazy(() => import('./pages/OrdersPage').then(({ OrdersPage }) => ({ default: OrdersPage }))),
  Profile: lazy(() => import('./pages/ProfilePage').then(({ ProfilePage }) => ({ default: ProfilePage }))),
  Login: lazy(() => import('./pages/LoginPage').then(({ LoginPage }) => ({ default: LoginPage }))),
  Register: lazy(() => import('./pages/RegisterPage').then(({ RegisterPage }) => ({ default: RegisterPage }))),
  Search: lazy(() => import('./pages/SearchPage').then(({ SearchPage }) => ({ default: SearchPage }))),
  Favorites: lazy(() => import('./pages/FavoritesPage').then(({ FavoritesPage }) => ({ default: FavoritesPage }))),
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <pages.Home /> },
      { path: 'product/:id', element: <pages.ProductDetail /> },
      { path: 'cart', element: <pages.Cart /> },
      { path: 'checkout', element: <RequireAuth><pages.Checkout /></RequireAuth> },
      { path: 'order-confirm/:orderId', element: <RequireAuth><pages.OrderConfirm /></RequireAuth> },
      { path: 'orders', element: <RequireAuth><pages.Orders /></RequireAuth> },
      { path: 'profile', element: <RequireAuth><pages.Profile /></RequireAuth> },
      { path: 'favorites', element: <RequireAuth><pages.Favorites /></RequireAuth> },
      { path: 'login', element: <pages.Login /> },
      { path: 'register', element: <pages.Register /> },
      { path: 'search', element: <pages.Search /> },
    ]
  }
]);
