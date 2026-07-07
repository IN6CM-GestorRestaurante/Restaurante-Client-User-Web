import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { GuestRoute } from './GuestRoute.jsx';

// Páginas de Autenticación
import { LoginPage } from '../../features/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../../features/auth/pages/RegisterPage.jsx';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage.jsx';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage.jsx';

// Páginas del Menú y Sucursales
import { CatalogPage } from '../../features/menus/pages/CatalogPage.jsx';
import { BranchesPage } from '../../features/branches/pages/BranchesPage.jsx';

// Carrito y Checkout
import { CheckoutPage } from '../../features/cart/pages/CheckoutPage.jsx';

// Pedidos
import { OrdersHistoryPage } from '../../features/orders/pages/OrdersHistoryPage.jsx';
import { OrderTrackingPage } from '../../features/orders/pages/OrderTrackingPage.jsx';

// Reservaciones
import { MyReservationsPage } from '../../features/reservations/pages/MyReservationsPage.jsx';
import { NewReservationPage } from '../../features/reservations/pages/NewReservationPage.jsx';

// Perfil
import { ProfilePage } from '../../features/profile/pages/ProfilePage.jsx';

// Reseñas
import { ReviewsPage } from '../../features/reviews/pages/ReviewsPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/catalog" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: '/verify-email',
        element: <VerifyEmailPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: '/catalog',
        element: <CatalogPage />,
      },
      {
        path: '/branches',
        element: <BranchesPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute>
            <OrdersHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders/:id',
        element: (
          <ProtectedRoute>
            <OrderTrackingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reservations',
        element: (
          <ProtectedRoute>
            <MyReservationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reservations/new',
        element: <NewReservationPage />,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reviews',
        element: <ReviewsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/catalog" replace />,
  },
]);
