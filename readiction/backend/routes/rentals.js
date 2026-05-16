const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

const RENTAL_DAYS = 7; // 7-day rental period
const PENALTY_PER_DAY = 5; // ₹5 per overdue day

// Get current user's rentals
router.get('/my', protect, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('book', 'title author genre coverImage rating')
      .sort({ rentedAt: -1 });

    // Update overdue status live
    const now = new Date();
    const updated = rentals.map(r => {
      const obj = r.toJSON();
      if (r.status === 'active' && now > new Date(r.dueDate)) {
        const daysLate = Math.ceil((now - new Date(r.dueDate)) / (1000 * 60 * 60 * 24));
        obj.status = 'overdue';
        obj.currentPenalty = daysLate * PENALTY_PER_DAY;
      } else if (r.status === 'active') {
        obj.currentPenalty = 0;
      }
      return obj;
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get ALL rentals (admin)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('book', 'title author genre coverImage')
      .populate('user', 'name email studentId')
      .sort({ rentedAt: -1 });

    const now = new Date();
    const updated = rentals.map(r => {
      const obj = r.toJSON();
      if (r.status === 'active' && now > new Date(r.dueDate)) {
        const daysLate = Math.ceil((now - new Date(r.dueDate)) / (1000 * 60 * 60 * 24));
        obj.status = 'overdue';
        obj.currentPenalty = daysLate * PENALTY_PER_DAY;
      }
      return obj;
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rent a book
router.post('/rent/:bookId', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check if already renting this book
    const existing = await Rental.findOne({
      user: req.user._id,
      book: req.params.bookId,
      status: { $in: ['active', 'overdue'] }
    });
    if (existing) return res.status(400).json({ message: 'You already have this book rented' });

    // Check unpaid penalties — block new rentals if penalty > ₹50
    const overdueRentals = await Rental.find({
      user: req.user._id,
      status: 'overdue',
      penaltyPaid: false
    });
    const now = new Date();
    let totalUnpaid = 0;
    overdueRentals.forEach(r => {
      const daysLate = Math.ceil((now - new Date(r.dueDate)) / (1000 * 60 * 60 * 24));
      totalUnpaid += daysLate * PENALTY_PER_DAY;
    });
    if (totalUnpaid > 50) {
      return res.status(400).json({ message: `You have ₹${totalUnpaid} in unpaid penalties. Please clear dues before renting new books.` });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + RENTAL_DAYS);

    const rental = await Rental.create({
      user: req.user._id,
      book: req.params.bookId,
      dueDate,
    });

    await rental.populate('book', 'title author genre coverImage rating');
    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Return a book
router.put('/return/:rentalId', protect, async (req, res) => {
  try {
    const rental = await Rental.findOne({ _id: req.params.rentalId, user: req.user._id });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (rental.status === 'returned') return res.status(400).json({ message: 'Book already returned' });

    const now = new Date();
    const due = new Date(rental.dueDate);
    let penalty = 0;
    if (now > due) {
      const daysLate = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
      penalty = daysLate * PENALTY_PER_DAY;
    }

    rental.returnedAt = now;
    rental.status = penalty > 0 ? 'overdue' : 'returned';
    rental.penaltyAmount = penalty;
    if (penalty === 0) rental.penaltyPaid = true;
    await rental.save();

    await rental.populate('book', 'title author genre coverImage rating');
    res.json({ rental, penalty, message: penalty > 0 ? `Book returned with ₹${penalty} penalty due` : 'Book returned successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Pay penalty
router.put('/pay-penalty/:rentalId', protect, async (req, res) => {
  try {
    const rental = await Rental.findOne({ _id: req.params.rentalId, user: req.user._id });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (rental.penaltyPaid) return res.status(400).json({ message: 'Penalty already paid' });

    // Compute final penalty
    const now = new Date();
    const due = new Date(rental.dueDate);
    if (now > due && rental.status !== 'returned') {
      const daysLate = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
      rental.penaltyAmount = daysLate * PENALTY_PER_DAY;
    }

    rental.penaltyPaid = true;
    if (rental.returnedAt) rental.status = 'returned';
    await rental.save();

    res.json({ message: `Penalty of ₹${rental.penaltyAmount} paid successfully!`, rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
