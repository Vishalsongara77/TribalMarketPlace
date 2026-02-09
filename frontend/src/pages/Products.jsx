import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiStar, FiLoader } from 'react-icons/fi'
import { productsAPI, wishlistAPI } from '../services/api'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import SearchFilter from '../components/SearchFilter'

const Products = () => {
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wishlistItems, setWishlistItems] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 10000],
    sortBy: 'relevance',
    inStock: false
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/products/categories/list')
        if (response.data.success) {
          setCategories(['All', ...response.data.categories])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Keep default categories if API fails
        setCategories(['All', 'Jewelry', 'Textiles', 'Pottery', 'Handicrafts'])
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = {}
        if (searchTerm) params.q = searchTerm
        if (filters.category) params.category = filters.category
        if (filters.priceRange && filters.priceRange.length === 2) {
          params.minPrice = filters.priceRange[0]
          params.maxPrice = filters.priceRange[1]
        }
        if (filters.sortBy && filters.sortBy !== 'relevance') {
          if (filters.sortBy === 'price_asc') {
            params.sortBy = 'price'
            params.sortOrder = 'asc'
          } else if (filters.sortBy === 'price_desc') {
            params.sortBy = 'price'
            params.sortOrder = 'desc'
          } else {
            params.sortBy = filters.sortBy
            params.sortOrder = 'desc'
          }
        }
        
        const response = await productsAPI.getProducts(params)
        let productData = response.data.products || response.data
        
        // Client-side filtering for in-stock products if needed
        if (filters.inStock) {
          productData = productData.filter(product => product.stock > 0)
        }
        
        setProducts(productData)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again.')
        // Fallback to demo data if API fails
        setProducts([
          {
            _id: '1',
            name: 'Tribal Beaded Necklace',
            price: 3799,
            originalPrice: 4299,
            seller: { name: 'Rajasthani Handicrafts' },
            category: { name: 'Jewelry' },
            rating: 4.5,
            reviews: 12,
            stock: 10,
            image: '/api/placeholder/300/300'
          },
          {
            _id: '2',
            name: 'Handwoven Tribal Rug',
            price: 7499,
            originalPrice: 8999,
            seller: { name: 'Weaving Traditions' },
            category: { name: 'Textiles' },
            rating: 4.8,
            reviews: 25,
            stock: 5,
            image: '/api/placeholder/300/300'
          },
          {
            _id: '3',
            name: 'Ceramic Tribal Bowl',
            price: 2699,
            seller: { name: 'Clay Masters' },
            category: { name: 'Pottery' },
            rating: 4.3,
            reviews: 8,
            stock: 0,
            image: '/api/placeholder/300/300'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchTerm, filters])
  
  // Fetch wishlist items when authenticated
  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        try {
          const response = await wishlistAPI.getWishlist()
          if (response.success) {
            setWishlistItems(response.items.map(item => item._id || item.productId))
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error)
          // Silent fail - don't show error to user
        }
      }
    }
    
    fetchWishlist()
  }, [isAuthenticated])
  
  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your wishlist')
      return
    }
    
    try {
      const isInWishlist = wishlistItems.includes(productId)
      
      if (isInWishlist) {
        await wishlistAPI.removeFromWishlist(productId)
        setWishlistItems(wishlistItems.filter(id => id !== productId))
        toast.success('Removed from wishlist')
      } else {
        await wishlistAPI.addToWishlist(productId)
        setWishlistItems([...wishlistItems, productId])
        toast.success('Added to wishlist')
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error)
      toast.error('Failed to update wishlist')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tribal Products</h1>
          <p className="text-gray-600 mt-2">Discover authentic handcrafted products from tribal artisans</p>
        </div>

        {/* Search and Filters */}
        <SearchFilter 
          onSearch={(term) => setSearchTerm(term)}
          onFilter={(newFilters) => setFilters(newFilters)}
          categories={categories.map((cat, index) => ({ id: cat, name: cat }))}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-amber-600" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      category: '',
                      priceRange: [0, 10000],
                      sortBy: 'relevance',
                      inStock: false
                    });
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/300/300'
                      }}
                    />
                  )}
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleWishlist(product._id);
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <FiHeart 
                        className={`w-5 h-5 ${wishlistItems.includes(product._id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                      />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded-full">
                      {product.category?.name || product.category}
                    </span>
                  </div>
                  {product.originalPrice && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {product.seller?.name || product.seller}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating || 0}</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.reviews || 0} reviews)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-amber-600">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/products/${product._id}`}
                      className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            )))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products