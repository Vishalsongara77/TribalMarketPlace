import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FiPackage, 
  FiShoppingCart, 
  FiDollarSign,
  FiTrendingUp,
  FiPlus,
  FiEye,
  FiEdit,
  FiBarChart
} from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'

const SellerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalEarnings: 0,
    pendingOrders: 0
  })

  const [recentProducts, setRecentProducts] = useState([])
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data for seller
      setStats({
        totalProducts: 24,
        totalOrders: 156,
        totalEarnings: 45000,
        pendingOrders: 8
      })

      setRecentProducts([
        { id: 1, name: 'Tribal Beaded Necklace', price: 3799, status: 'Active', views: 245 },
        { id: 2, name: 'Handwoven Rug', price: 7499, status: 'Active', views: 189 },
        { id: 3, name: 'Ceramic Bowl', price: 2699, status: 'Pending', views: 67 }
      ])

      setRecentOrders([
        { id: 'ORD001', product: 'Tribal Necklace', amount: 3799, status: 'Shipped', date: '2024-01-15' },
        { id: 'ORD002', product: 'Handwoven Rug', amount: 7499, status: 'Processing', date: '2024-01-14' },
        { id: 'ORD003', product: 'Ceramic Bowl', amount: 2699, status: 'Delivered', date: '2024-01-13' }
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'List a new product for sale',
      icon: FiPlus,
      link: '/seller/products/add',
      color: 'bg-green-500'
    },
    {
      title: 'Manage Products',
      description: 'View and edit your products',
      icon: FiPackage,
      link: '/seller/products',
      color: 'bg-blue-500'
    },
    {
      title: 'View Orders',
      description: 'Manage your orders',
      icon: FiShoppingCart,
      link: '/seller/orders',
      color: 'bg-purple-500'
    },
    {
      title: 'Earnings Report',
      description: 'View your earnings',
      icon: FiBarChart,
      link: '/seller/earnings',
      color: 'bg-orange-500'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Shipped':
        return 'bg-blue-100 text-blue-800'
      case 'Processing':
        return 'bg-purple-100 text-purple-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Here's what's happening with your shop.</p>
          <p className="text-gray-600 mt-2">The Seller Dashboard is designed specifically for tribal artisans and product sellers, allowing you to manage your digital shop easily. From here, you can add new products by uploading images, setting prices, and writing descriptions. You can also track inventory, update product details, and respond to customer reviews. The dashboard provides real-time insights about orders received, pending shipments, delivered orders, and earnings. It helps you efficiently manage your business, maintain product quality, and engage directly with customers without intermediaries, thus ensuring fair income and autonomy.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`p-3 ${action.color} rounded-lg w-fit mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                <Link to="/seller/products" className="text-blue-600 hover:text-blue-700 text-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">₹{product.price}</span>
                        <span className="flex items-center text-sm text-gray-600">
                          <FiEye className="w-4 h-4 mr-1" />
                          {product.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <FiEdit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <Link to="/seller/orders" className="text-blue-600 hover:text-blue-700 text-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">#{order.id}</h4>
                      <p className="text-sm text-gray-600">{order.product}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{order.amount}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard