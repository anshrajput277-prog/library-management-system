# Library Management System - Backend API Submission

This document contains all the necessary code, outputs, and MongoDB details for creating the PDF submission for the **MSE-1 EXAMINATION (PRACTICAL)**.

## 1. Code

### `package.json` (Dependencies)
```json
{
  "name": "library-management-system",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "mongoose": "^8.7.0"
  }
}
```

### `server.js`
```javascript
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const bookRoutes = require('./routes/books');

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // Enable JSON parsing

app.use('/books', bookRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### `config/db.js`
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
```

### `models/Book.js`
```javascript
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'] },
    isbn: { type: String, required: [true, 'ISBN is required'], unique: true },
    author: { type: String, required: [true, 'Author is required'] },
    totalCopies: { type: Number, required: [true, 'Total Copies is required'], min: [1, 'Total Copies must be positive'] },
    genre: { type: String, required: [true, 'Genre is required'] },
    publisher: { type: String, required: [true, 'Publisher is required'] },
    status: { type: String, default: 'Available', enum: ['Available', 'Checked Out'] }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
```

### `routes/books.js`
```javascript
const express = require('express');
const router = express.Router();
const { getBooks, getBookById, addBook, updateBook, deleteBook, searchBooks } = require('../controllers/bookController');

router.get('/search', searchBooks);
router.route('/').get(getBooks).post(addBook);
router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);

module.exports = router;
```

### `controllers/bookController.js`
```javascript
const Book = require('../models/Book');

// POST /books
const addBook = async (req, res, next) => {
    try {
        const bookExists = await Book.findOne({ isbn: req.body.isbn });
        if (bookExists) {
            res.status(400); throw new Error('Book already exists');
        }
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400); next(error);
    }
};

// GET /books
const getBooks = async (req, res, next) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) { next(error); }
};

// GET /books/:id
const getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) res.status(200).json(book);
        else { res.status(404); throw new Error('Book not found'); }
    } catch (error) { next(error); }
};

// PUT /books/:id
const updateBook = async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedBook) res.status(200).json(updatedBook);
        else { res.status(404); throw new Error('Book not found'); }
    } catch (error) { res.status(400); next(error); }
};

// DELETE /books/:id
const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            await Book.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Deleted successfully' });
        } else { res.status(404); throw new Error('Book not found'); }
    } catch (error) { next(error); }
};

// GET /books/search?title=xyz
const searchBooks = async (req, res, next) => {
    try {
        const keyword = req.query.title ? { title: { $regex: req.query.title, $options: 'i' } } : {};
        const books = await Book.find({ ...keyword });
        res.status(200).json(books);
    } catch (error) { next(error); }
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook, searchBooks };
```

### `middleware/errorHandler.js`
```javascript
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({ message: err.message });
};

module.exports = { errorHandler };
```

---

## 2. Postman Requests Setup (For screenshots)

Before taking screenshots for your assignment, use Postman to send these requests to your local server (make sure you add a valid `MONGO_URI` to `.env` and run `node server.js`).

**1. POST /books (Add a book)**
- **Method:** POST
- **URL:** `http://localhost:5000/books`
- **Body (raw JSON):**
```json
{
    "title": "The Great Gatsby",
    "isbn": "123456789",
    "author": "F. Scott Fitzgerald",
    "totalCopies": 5,
    "genre": "Classic",
    "publisher": "Scribner"
}
```

**2. GET /books (Get all books)**
- **Method:** GET
- **URL:** `http://localhost:5000/books`

**3. GET /books/:id (Get by ID)**
- **Method:** GET
- **URL:** `http://localhost:5000/books/<insert_id_from_above>`

**4. PUT /books/:id (Update book)**
- **Method:** PUT
- **URL:** `http://localhost:5000/books/<insert_id_from_above>`
- **Body (raw JSON):**
```json
{
    "totalCopies": 10
}
```

**5. GET /books/search?title=xyz (Search books)**
- **Method:** GET
- **URL:** `http://localhost:5000/books/search?title=Great`

**6. DELETE /books/:id (Delete book)**
- **Method:** DELETE
- **URL:** `http://localhost:5000/books/<insert_id_from_above>`

---

## 3. Deployment Links (To be filled by you after GitHub/Render push)
- **GitHub Repository Link:** `[Insert your GitHub link here]`
- **Render Live URL:** `[Insert your Render URL here]`

*(Note: Don't forget to add your MongoDB connection string in Render's Environment Variables when deploying!)*
