import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';

// Public Pages
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import FeaturesPage from './pages/public/FeaturesPage';
import HomePage from './pages/public/HomePage';
import PricingPage from './pages/public/PricingPage';

// Dashboard Pages
import BillingPage from './pages/dashboard/BillingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import SubscriptionPage from './pages/dashboard/SubscriptionPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import SettingsAdminPage from './pages/admin/SettingsAdminPage';
import SubscriptionsPage from './pages/admin/SubscriptionsPage';
import TenantsPage from './pages/admin/TenantsPage';
import UsersPage from './pages/admin/UsersPage';

// Error Pages
import NotFoundPage from './pages/error/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user has required role
  // For admin routes, allow both 'admin' and 'super-admin' roles
  if (requiredRole) {
    if (requiredRole === 'admin' && (user.role === 'admin' || user.role === 'super-admin')) {
      // Allow access for admin and super-admin to admin routes
    } else if (user.role !== requiredRole) {
      // For other roles, require exact match
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

function App() {
  const { darkMode } = useTheme();
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="settings" element={<SettingsAdminPage />} />
      </Route>

      {/* Error Routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
