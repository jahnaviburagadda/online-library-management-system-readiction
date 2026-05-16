const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  rentedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnedAt: { type: Date, default: null },
  status: { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' },
  penaltyAmount: { type: Number, default: 0 },
  penaltyPaid: { type: Boolean, default: false },
});

// Auto-compute penalty: ₹5 per overdue day
rentalSchema.virtual('currentPenalty').get(function () {
  if (this.status === 'returned') return this.penaltyAmount;
  const now = new Date();
  const due = new Date(this.dueDate);
  if (now <= due) return 0;
  const daysLate = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
  return daysLate * 5;
});

rentalSchema.set('toJSON', { virtuals: true });
rentalSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Rental', rentalSchema);
