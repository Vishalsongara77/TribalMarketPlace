import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import ProtectedRoleRoute from './components/ProtectedRoleRoute'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Wishlist from './pages/Wishlist'
import CartPage from './pages/CartPage'
import PaymentPage from './pages/PaymentPage'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import UserProfile from './pages/UserProfile'
import OrderTracking from './pages/OrderTracking'
import DemoCancelOrder from './pages/DemoCancelOrder'

// Dashboard Pages
import BuyerDashboard from './pages/BuyerDashboard'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ArtisanDashboard from './pages/ArtisanDashboard'

// Admin Pages
import AdminProducts from './pages/AdminProducts'
import AdminUsers from './pages/AdminUsers'
import AdminOrders from './pages/AdminOrders'

// Other Pages
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="demo-cancel-order" element={<DemoCancelOrder />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="order-tracking" element={<OrderTracking />} />
            <Route path="order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="profile" element={<ProtectedRoleRoute allowedRoles={['buyer', 'seller', 'admin', 'artisan']}><UserProfile /></ProtectedRoleRoute>} />
            <Route path="wishlist" element={<ProtectedRoleRoute allowedRoles={['buyer']}><Wishlist /></ProtectedRoleRoute>} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            
            {/* Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            
            {/* Role-based Dashboard Routes */}
            <Route path="admin/dashboard" element={
              <ProtectedRoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoleRoute>
            } />
            <Route path="admin/users" element={
              <ProtectedRoleRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoleRoute>
            } />
            <Route path="admin/orders" element={
              <ProtectedRoleRoute allowedRoles={['admin']}>
                <AdminOrders />
              </ProtectedRoleRoute>
            } />
            
            <Route path="seller/dashboard" element={
              <ProtectedRoleRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoleRoute>
            } />
            
            <Route path="seller/products" element={
              <ProtectedRoleRoute allowedRoles={['seller']}>
                <AdminProducts />
              </ProtectedRoleRoute>
            } />
            
            <Route path="seller/products/add" element={
              <ProtectedRoleRoute allowedRoles={['seller']}>
                <AdminProducts isAddMode={true} />
              </ProtectedRoleRoute>
            } />
            
            <Route path="artisan/dashboard" element={
              <ProtectedRoleRoute allowedRoles={['artisan']}>
                <ArtisanDashboard />
              </ProtectedRoleRoute>
            } />
            
            <Route path="buyer/dashboard" element={
              <ProtectedRoleRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoleRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="admin/products" element={
              <ProtectedRoleRoute allowedRoles={['admin']}>
                <AdminProducts />
              </ProtectedRoleRoute>
            } />
            
            {/* Redirect old routes */}
            <Route path="dashboard" element={<Navigate to="/buyer/dashboard" replace />} />
            <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="seller" element={<Navigate to="/seller/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  </ErrorBoundary>
  )
}

export default App