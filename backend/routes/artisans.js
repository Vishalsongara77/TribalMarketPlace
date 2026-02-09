const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/artisans
// @desc    Get all artisans
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      artisans: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;