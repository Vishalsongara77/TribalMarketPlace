const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/payments/create
// @desc    Create payment
// @access  Private
router.post('/create', [auth, require('../middleware/csrf')], async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Payment created'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;