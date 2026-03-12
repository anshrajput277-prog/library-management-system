const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
} = require('../controllers/bookController');

// Search route must come before /:id route
router.get('/search', searchBooks);

// Base /books routes
router.route('/').get(getBooks).post(addBook);

// /books/:id routes
router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);

module.exports = router;
