import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  // Books
  getBooks: () => axios.get(`${API_BASE}/books`),
  getBook: (id) => axios.get(`${API_BASE}/books/${id}`),
  getBooksByGenre: (genre) => axios.get(`${API_BASE}/books/genre/${genre}`),
  addBook: (data) => axios.post(`${API_BASE}/books`, data),
  updateBook: (id, data) => axios.put(`${API_BASE}/books/${id}`, data),
  deleteBook: (id) => axios.delete(`${API_BASE}/books/${id}`),
  // Wishlist
  getWishlist: () => axios.get(`${API_BASE}/wishlist`),
  addToWishlist: (bookId) => axios.post(`${API_BASE}/wishlist/${bookId}`),
  removeFromWishlist: (bookId) => axios.delete(`${API_BASE}/wishlist/${bookId}`),
};

export default api;
