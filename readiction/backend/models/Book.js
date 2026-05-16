const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  genre:       { type: String, required: true, enum: ['Classic','Crime','Thriller','Mystery','Fiction','Romance'] },
  language:    { type: String, default: 'English' },
  rating:      { type: Number, default: 4.0, min: 0, max: 5 },
  coverImage:  { type: String, default: '' },
  description: { type: String },
  pages:       [{ pageNumber: Number, content: String }],
  totalPages:  { type: Number, default: 15 },
  section:     { type: String, enum: ['browse','genre'], default: 'browse' },
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
