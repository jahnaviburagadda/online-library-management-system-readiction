const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/books',   require('./routes/books'));
app.use('/api/wishlist',require('./routes/wishlist'));
app.use('/api/rentals', require('./routes/rentals'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/readiction';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    // Force reseed check — clears stale data so new catalog loads on first request
    const Book = require('./models/Book');
    const browseCount = await Book.countDocuments({ section: 'browse' });
    const genreCount  = await Book.countDocuments({ section: 'genre'  });
    if (browseCount !== 24 || genreCount !== 24) {
      await Book.deleteMany({});
      console.log('🗑  Cleared stale book data — fresh seed will run on first API request');
    } else {
      console.log(`📚 Books OK: ${browseCount} browse + ${genreCount} genre`);
    }
  })
  .catch(err => console.log('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
