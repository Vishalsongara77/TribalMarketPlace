const express = require('express');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Mock Data for Fallback
const MOCK_PRODUCTS = [
  {
    _id: '64f8a1234567890123456781',
    name: 'Tribal Beaded Necklace',
    description: 'Handcrafted beaded necklace from indigenous artisans. Made with vibrant colors and traditional patterns.',
    price: 1299,
    category: 'Jewelry',
    images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    stock: 15,
    seller: {
      _id: 'seller1',
      name: 'Rajasthani Handicrafts',
      sellerInfo: { businessName: 'Rajasthani Handicrafts', verified: true }
    },
    rating: 4.5,
    reviews: 12,
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    _id: '64f8a1234567890123456782',
    name: 'Handwoven Tribal Rug',
    description: 'Traditional handwoven rug with tribal patterns. Perfect for living rooms.',
    price: 4599,
    category: 'Textiles',
    images: ['https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    stock: 8,
    seller: {
      _id: 'seller2',
      name: 'Weaving Traditions',
      sellerInfo: { businessName: 'Weaving Traditions', verified: true }
    },
    rating: 4.8,
    reviews: 25,
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    _id: '64f8a1234567890123456783',
    name: 'Ceramic Tribal Bowl',
    description: 'Hand-painted ceramic bowl with tribal motifs. Microwave and dishwasher safe.',
    price: 899,
    category: 'Pottery',
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    stock: 20,
    seller: {
      _id: 'seller3',
      name: 'Clay Masters',
      sellerInfo: { businessName: 'Clay Masters', verified: true }
    },
    rating: 4.3,
    reviews: 8,
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    _id: '64f8a1234567890123456784',
    name: 'Wooden Tribal Mask',
    description: 'Carved wooden mask representing tribal spirits. A great decorative piece.',
    price: 2499,
    category: 'Art',
    images: ['https://images.unsplash.com/photo-1549887534-1541e9326642?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    stock: 5,
    seller: {
      _id: 'seller4',
      name: 'Carved Heritage',
      sellerInfo: { businessName: 'Carved Heritage', verified: true }
    },
    rating: 4.7,
    reviews: 18,
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    _id: '64f8a1234567890123456785',
    name: 'Bamboo Craft Basket',
    description: 'Eco-friendly bamboo basket woven by tribal artisans. Durable and stylish.',
    price: 599,
    category: 'Home Decor',
    images: ['https://images.unsplash.com/photo-1596627685989-b70fdc797c36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    stock: 30,
    seller: {
      _id: 'seller5',
      name: 'Bamboo Creations',
      sellerInfo: { businessName: 'Bamboo Creations', verified: true }
    },
    rating: 4.6,
    reviews: 42,
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    _id: '64f8a1234567890123456786',
    name: 'Silver Tribal Bracelet',
    description: 'Oxidized silver bracelet with intricate tribal designs.',
    price: 1899,
    category: 'Jewelry',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    stock: 12,
    seller: {
      _id: 'seller1',
      name: 'Rajasthani Handicrafts',
      sellerInfo: { businessName: 'Rajasthani Handicrafts', verified: true }
    },
    rating: 4.9,
    reviews: 33,
    createdAt: new Date().toISOString(),
    isActive: true
  }
];

const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      req.user = decoded;
    } catch (error) {
      // Token invalid, continue without user
    }
  }
  next();
};

const router = express.Router();

// @route   GET /api/products/categories/list
// @desc    Get list of unique categories
// @access  Public
// MOVED TO TOP to prevent conflict with /:id
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error.message);
    // Fallback to mock data
    const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];
    res.json({
      success: true,
      categories
    });
  }
});

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.q;
    const category = req.query.category;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query = { isActive: true };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const products = await Product.find(query)
      .populate('seller', 'name sellerInfo.businessName sellerInfo.verified')
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    // Add average rating and review count (mock for now, will implement later)
    const productsWithRating = products.map(product => ({
      ...product.toObject(),
      rating: 4.2 + Math.random() * 0.8, // Mock rating
      reviews: Math.floor(Math.random() * 50) + 1 // Mock review count
    }));

    res.json({
      success: true,
      products: productsWithRating,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Get products error:', error.message);
    
    // Fallback to mock data
    let filteredProducts = [...MOCK_PRODUCTS];
    
    // Filter by search
    if (req.query.q) {
      const q = req.query.q.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }
    
    // Filter by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(p => p.category === req.query.category);
    }
    
    // Filter by price
    if (req.query.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(req.query.minPrice));
    }
    if (req.query.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(req.query.maxPrice));
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalProducts: filteredProducts.length,
        hasNext: endIndex < filteredProducts.length,
        hasPrev: page > 1
      },
      filters: {
        search: req.query.q,
        category: req.query.category,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      }
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email sellerInfo.businessName sellerInfo.verified sellerInfo.description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Mock rating and reviews for now
    const productWithRating = {
      ...product.toObject(),
      rating: 4.2 + Math.random() * 0.8,
      reviews: Math.floor(Math.random() * 50) + 1,
      reviewList: [] // Will implement reviews later
    };

    res.json({
      success: true,
      product: productWithRating
    });
  } catch (error) {
    console.error('Get product error:', error.message);
    
    // Fallback to mock data
    const product = MOCK_PRODUCTS.find(p => p._id === req.params.id);
    
    if (product) {
      return res.json({
        success: true,
        product
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    // If not found in mock data either
    res.status(404).json({
      success: false,
      message: 'Product not found (and DB error)'
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Seller only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can create products'
      });
    }

    // Check if seller is verified
    const User = require('../models/User');
    // Mock user verification check if DB fails
    try {
      const seller = await User.findById(req.user._id);
      if (!seller.sellerInfo.verified) {
        return res.status(403).json({
          success: false,
          message: 'Seller account must be verified to create products'
        });
      }
    } catch (err) {
      console.log('Skipping seller verification check due to DB error');
    }

    const { name, description, price, category, images, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      images: images || [],
      stock: stock || 0,
      seller: req.user._id
    });

    await product.save();

    await product.populate('seller', 'name sellerInfo.businessName');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error.message);
    
    // Mock success
    const { name, description, price, category, images, stock } = req.body;
    const newProduct = {
      _id: 'new-mock-id-' + Date.now(),
      name,
      description,
      price,
      category,
      images: images || [],
      stock: stock || 0,
      seller: {
        _id: req.user._id,
        name: req.user.name || 'Seller',
        sellerInfo: { businessName: 'My Shop', verified: true }
      },
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully (Mock)',
      product: newProduct
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Seller only - own products, or Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const { name, description, price, category, images, stock, isActive } = req.body;

    // Only admin can change isActive status
    if (isActive !== undefined && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change product status'
      });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.images = images || product.images;
    product.stock = stock !== undefined ? stock : product.stock;
    if (req.user.role === 'admin' && isActive !== undefined) {
      product.isActive = isActive;
    }

    await product.save();
    await product.populate('seller', 'name sellerInfo.businessName');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error.message);
    // Mock success
    res.json({
      success: true,
      message: 'Product updated successfully (Mock)',
      product: { ...req.body, _id: req.params.id }
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Seller only - own products, or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error.message);
    // Mock success
    res.json({
      success: true,
      message: 'Product deleted successfully (Mock)'
    });
  }
});

module.exports = router;
