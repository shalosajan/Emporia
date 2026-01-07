// src/App.jsx

import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Import our page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';

// --- Import our new layout components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/ProtectedRoute';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SellerDashboard from './pages/SellerDashboard';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';

import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './layouts/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import TeamManagement from './pages/admin/TeamManagement';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminLoginPage from './pages/AdminLoginPage';
import ImpersonationBanner from './components/ImpersonationBanner';
import { AlertProvider } from './context/AlertContext';

// Main App Component - Force Rebuild
function App() {
  return (
    <AlertProvider>
      <ImpersonationBanner />
      <Routes>
        {/* --- Public Routes & Main Layout --- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="orders/history" element={<OrderHistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route path="seller/dashboard" element={<SellerDashboard />} />
            <Route path="seller/add-product" element={<AddProductPage />} />
            <Route path="seller/edit-product/:slug" element={<EditProductPage />} />
          </Route>
        </Route>

        {/* --- Admin Layout Routes (Separate Layout) --- */}
        <Route path="/admin-secure-portal" element={<AdminLoginPage />} />

        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} /> {/* Default to dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>
      </Routes>
    </AlertProvider>
  );
}

// --- Updated Main Layout Component ---
function MainLayout() {
  return (
    // Use flex-col and min-h-screen to make the footer
    // stick to the bottom of the page
    <div className="flex flex-col min-h-screen bg-obsidian text-gray-100 selection:bg-indigo-500/30">

      {/* 1. Use the real Navbar component */}
      <Navbar />

      {/* 'flex-grow' makes the main content take up all available space */}
      {/* Removed container/padding to allow full-width Hero sections */}
      <main className="flex-grow flex flex-col relative">
        {/* Global Background Elements could go here if needed across all pages */}
        <div className="flex-grow flex flex-col">
          <Outlet />
        </div>
      </main>

      {/* 2. Use the real Footer component */}
      <Footer />

    </div>
  );
}

export default App;