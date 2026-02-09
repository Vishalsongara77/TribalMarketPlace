import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token and CSRF protection
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add CSRF token for state-changing requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
      try {
        const { getCsrfToken } = await import('../utils/csrf')
        const csrfToken = await getCsrfToken()
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken
        }
      } catch (error) {
        console.warn('Failed to get CSRF token:', error)
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid/expired token; let calling code handle navigation
      localStorage.removeItem('token')
      // Avoid hard redirect to prevent request abort and dev-server errors
      // Components/pages should check auth and navigate appropriately
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => {
    try {
      return api.post('/auth/login', credentials)
        .catch(error => {
          // For demo users, use demo login endpoint
          if (credentials.email && credentials.email.includes('example.com')) {
            return api.post('/demo/login', credentials);
          }
          return Promise.reject(error);
        });
    } catch (error) {
      console.error('Login error:', error);
      return Promise.resolve({ data: { success: false, message: 'Login failed' } });
    }
  },
  register: (userData) => api.post('/auth/register', userData).catch(() => api.post('/demo/register', userData)),
  getProfile: () => api.get('/auth/me').catch(() => api.get('/demo/me')),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
}

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }).catch(() => api.get('/demo/products', { params })),
  getProduct: (id) => api.get(`/products/${id}`).catch(() => api.get(`/demo/products/${id}`)),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getSellerProducts: (params) => api.get('/products/seller/my-products', { params }),
  getProductReviews: (productId) => api.get(`/products/${productId}/reviews`).catch(() => {
    console.log('Falling back to demo product reviews');
    return { 
      data: { 
        reviews: [
          { _id: '1', rating: 5, comment: 'Beautiful craftsmanship!', user: { _id: 'u1', name: 'Priya Sharma', avatar: '/images/avatars/user1.jpg' }, createdAt: '2023-06-15T10:30:00Z' },
          { _id: '2', rating: 4, comment: 'Great quality, fast shipping', user: { _id: 'u2', name: 'Rahul Patel', avatar: '/images/avatars/user2.jpg' }, createdAt: '2023-06-10T14:20:00Z' },
          { _id: '3', rating: 5, comment: 'Authentic tribal design, love it!', user: { _id: 'u3', name: 'Ananya Singh', avatar: '/images/avatars/user3.jpg' }, createdAt: '2023-05-28T09:15:00Z' }
        ] 
      } 
    };
  }),
  addProductReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData).catch(() => {
    console.log('Falling back to demo add review endpoint');
    return { data: { success: true } };
  }),
}

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get('/categories').catch(() => api.get('/demo/products/categories/list')),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
}

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart').catch(() => api.get('/demo/cart')),
  addToCart: (productId, quantity) => {
    return api.post('/cart/add', { productId, quantity })
      .catch(error => {
        console.log('Falling back to demo cart endpoint');
        return api.post('/demo/cart/add', { productId, quantity });
      });
  },
  updateQuantity: (productId, quantity) => {
    return api.put('/cart/update', { productId, quantity })
      .catch(error => {
        console.log('Falling back to demo cart update endpoint');
        return api.put('/demo/cart/update', { productId, quantity });
      });
  },
  removeFromCart: (productId) => {
    return api.delete(`/cart/remove/${productId}`)
      .catch(error => {
        console.log('Falling back to demo cart remove endpoint');
        return api.delete(`/demo/cart/remove/${productId}`);
      });
  },
  clearCart: () => {
    return api.delete('/cart/clear')
      .catch(error => {
        console.log('Falling back to demo cart clear endpoint');
        return api.delete('/demo/cart/clear');
      });
  },
}

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/checkout', orderData).catch(() => api.post('/orders', orderData)),
  getOrders: (params) => api.get('/orders', { params }).catch(() => api.get('/demo/orders', { params })),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
}

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/users/wishlist').catch(() => {
    console.log('Falling back to demo wishlist endpoint');
    return { 
      data: { 
        items: [
          { _id: '1', name: 'Handcrafted Tribal Necklace', price: 1299, stock: 15, images: ['/images/products/necklace.jpg'], category: { name: 'Jewelry' } },
          { _id: '2', name: 'Traditional Bamboo Flute', price: 899, stock: 8, images: ['/images/products/flute.jpg'], category: { name: 'Musical Instruments' } },
          { _id: '3', name: 'Tribal Art Wall Hanging', price: 2499, stock: 5, images: ['/images/products/art.jpg'], category: { name: 'Home Decor' } }
        ] 
      } 
    };
  }),
  addToWishlist: (productId) => api.post('/users/wishlist/add', { productId }).catch(() => {
    console.log('Falling back to demo wishlist add endpoint');
    return { data: { success: true } };
  }),
  removeFromWishlist: (productId) => api.delete(`/users/wishlist/remove/${productId}`).catch(() => {
    console.log('Falling back to demo wishlist remove endpoint');
    return { data: { success: true } };
  })
}

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard').catch(() => api.get('/demo/admin/dashboard')),
  getUsers: (params) => api.get('/admin/users', { params }).catch(() => api.get('/demo/admin/users', { params })),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  getProducts: (params) => api.get('/admin/products', { params }).catch(() => api.get('/demo/admin/products', { params })),
  approveProduct: (id) => api.put(`/admin/products/${id}/approve`),
}

// Quick Actions API
export const quickActionsAPI = {
  getQuickActions: () => api.get('/quick-actions').catch(() => {
    // Fallback data if API fails
    const userRole = localStorage.getItem('userRole') || 'buyer';
    let quickActions = [];
    
    if (userRole === 'admin') {
      quickActions = [
        { id: 'manage-products', title: 'Manage Products', description: 'View and manage all products', icon: 'FiPackage', link: '/admin/products', color: 'bg-blue-500' },
        { id: 'user-management', title: 'User Management', description: 'Manage users and permissions', icon: 'FiUsers', link: '/admin/users', color: 'bg-green-500' },
        { id: 'order-management', title: 'Order Management', description: 'Track and manage orders', icon: 'FiShoppingCart', link: '/admin/orders', color: 'bg-purple-500' },
        { id: 'analytics', title: 'Analytics', description: 'View detailed analytics', icon: 'FiBarChart', link: '/admin/analytics', color: 'bg-orange-500' }
      ];
    } else if (userRole === 'seller') {
      quickActions = [
        { id: 'add-product', title: 'Add New Product', description: 'List a new product for sale', icon: 'FiPlus', link: '/seller/products/add', color: 'bg-green-500' },
        { id: 'manage-products', title: 'Manage Products', description: 'View and edit your products', icon: 'FiPackage', link: '/seller/products', color: 'bg-blue-500' },
        { id: 'view-orders', title: 'View Orders', description: 'Manage your orders', icon: 'FiShoppingCart', link: '/seller/orders', color: 'bg-purple-500' },
        { id: 'earnings', title: 'Earnings Report', description: 'View your earnings', icon: 'FiBarChart', link: '/seller/earnings', color: 'bg-orange-500' }
      ];
    } else {
      quickActions = [
        { id: 'browse-products', title: 'Browse Products', description: 'Discover new tribal crafts', icon: 'FiPackage', link: '/products', color: 'bg-blue-500' },
        { id: 'my-orders', title: 'My Orders', description: 'Track your orders', icon: 'FiShoppingCart', link: '/orders', color: 'bg-green-500' },
        { id: 'wishlist', title: 'Wishlist', description: 'View saved items', icon: 'FiHeart', link: '/wishlist', color: 'bg-red-500' },
        { id: 'profile', title: 'Profile Settings', description: 'Update your profile', icon: 'FiUser', link: '/profile', color: 'bg-purple-500' }
      ];
    }
    
    return { data: { success: true, quickActions } };
  }),
}

// EHR API
export const ehrAPI = {
  createRecord: (recordData) => api.post('/ehr', recordData),
  getPatientRecords: (patientId) => api.get(`/ehr/patient/${patientId}`),
  getDoctorRecords: () => api.get('/ehr/doctor'),
  updateRecord: (id, recordData) => api.put(`/ehr/${id}`, recordData),
  deleteRecord: (id) => api.delete(`/ehr/${id}`),
}

export default api
