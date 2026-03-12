const Book = require('../models/Book');

// @desc    Get all book records
// @route   GET /books
// @access  Public
const getBooks = async (req, res, next) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

// @desc    Get book by ID
// @route   GET /books/:id
// @access  Public
const getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404);
            throw new Error('Book not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Add a new book
// @route   POST /books
// @access  Public
const addBook = async (req, res, next) => {
    try {
        const { title, isbn, author, totalCopies, genre, publisher, status } = req.body;

        // Basic validation is handled by mongoose, but good to check if book exists
        const bookExists = await Book.findOne({ isbn });

        if (bookExists) {
            res.status(400);
            throw new Error('Book with this ISBN already exists');
        }

        const book = await Book.create({
            title,
            isbn,
            author,
            totalCopies,
            genre,
            publisher,
            status
        });

        if (book) {
            res.status(201).json(book);
        } else {
            res.status(400);
            throw new Error('Invalid book data');
        }
    } catch (error) {
        res.status(400); // Bad Request for validation errors
        next(error);
    }
};

// @desc    Update book details
// @route   PUT /books/:id
// @access  Public
const updateBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            const updatedBook = await Book.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            res.status(200).json(updatedBook);
        } else {
            res.status(404);
            throw new Error('Book not found');
        }
    } catch (error) {
        // If it's a validation error, we might want 400
        if (error.name === 'ValidationError') {
            res.status(400);
        }
        next(error);
    }
};

// @desc    Delete book record
// @route   DELETE /books/:id
// @access  Public
const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            await Book.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Book record deleted successfully' });
        } else {
            res.status(404);
            throw new Error('Book not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Search books by title or author
// @route   GET /books/search?title=xyz
// @access  Public
const searchBooks = async (req, res, next) => {
    try {
        const keyword = req.query.title ? {
            title: {
                $regex: req.query.title,
                $options: 'i' // case insensitive
            }
        } : {};

        // Also handle search by author just in case, per requirements "Search books by title or author"
        if(req.query.author && !req.query.title) {
            keyword.author = {
                $regex: req.query.author,
                $options: 'i'
            };
        }

        // if both title and author are provided in query param
        if(req.query.title && req.query.author) {
            delete keyword.title;
            keyword.$or = [
                { title: { $regex: req.query.title, $options: 'i' } },
                { author: { $regex: req.query.author, $options: 'i' } }
            ];
        }

        const books = await Book.find({ ...keyword });
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    searchBooks
};
