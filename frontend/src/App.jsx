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
import CheckoutPage from './pages/Checkoutpage';
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

function App() {
  return (
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
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} /> {/* Default to dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
}

// --- Updated Main Layout Component ---
function MainLayout() {
  return (
    // Use flex-col and min-h-screen to make the footer
    // stick to the bottom of the page
    <div className="flex flex-col min-h-screen">

      {/* 1. Use the real Navbar component */}
      <Navbar />

      {/* 'flex-grow' makes the main content take up all available space */}
      <main className="flex-grow container mx-auto p-8">
        <Outlet />
      </main>

      {/* 2. Use the real Footer component */}
      <Footer />

    </div>
  );
}

export default App;