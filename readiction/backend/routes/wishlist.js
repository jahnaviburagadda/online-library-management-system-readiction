const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to wishlist
router.post('/:bookId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(req.params.bookId)) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }
    user.wishlist.push(req.params.bookId);
    await user.save();
    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove from wishlist
router.delete('/:bookId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.bookId);
    await user.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
