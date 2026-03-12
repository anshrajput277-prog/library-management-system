const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const bookRoutes = require('./routes/books');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable express.json() middleware
app.use(express.json());

// Routes
app.use('/books', bookRoutes);

// Custom Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
