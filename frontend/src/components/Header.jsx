import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiHeart, FiSettings, FiShoppingBag } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Avatar from './Avatar'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  let user, isAuthenticated, logout
  
  try {
    const auth = useAuth()
    user = auth.user
    isAuthenticated = auth.isAuthenticated
    logout = auth.logout
  } catch (error) {
    // Handle case when AuthContext is not available
    user = null
    isAuthenticated = false
    logout = () => {}
  }
  
  // Get cart information
  const { totalItems } = useCart()
  
  const navigate = useNavigate()

  const navigationLinks = [
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard'
      case 'seller':
        return '/seller/dashboard'
      case 'artisan':
        return '/artisan/dashboard'
      case 'buyer':
        return '/buyer/dashboard'
      default:
        return '/'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-amber-600">Tribal Marketplace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - Always visible */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-700 hover:text-amber-600 transition-colors"
                  aria-label="Wishlist"
                >
                  <FiHeart className="w-5 h-5" />
                </Link>
                
                {/* My Orders */}
                <Link
                  to="/orders"
                  className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-amber-600 transition-colors"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  <span className="hidden lg:block">My Orders</span>
                </Link>
                
                {/* Profile Settings */}
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-amber-600 transition-colors"
                >
                  <FiSettings className="w-5 h-5" />
                  <span className="hidden lg:block">Profile</span>
                </Link>
                
                {/* Dashboard */}
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="hidden sm:block">{user?.name}</span>
                </Link>
                
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-amber-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-amber-600"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-700 hover:text-amber-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header