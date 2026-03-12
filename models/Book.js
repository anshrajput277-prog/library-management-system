const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        isbn: {
            type: String,
            required: [true, 'ISBN is required'],
            unique: true,
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
        },
        totalCopies: {
            type: Number,
            required: [true, 'Total Copies is required'],
            min: [1, 'Total Copies must be a positive number'],
        },
        genre: {
            type: String,
            required: [true, 'Genre / Category is required'],
        },
        publisher: {
            type: String,
            required: [true, 'Publisher is required'],
        },
        status: {
            type: String,
            default: 'Available',
            enum: ['Available', 'Checked Out'],
        },
        // Auto generated ID is handled by MongoDB default _id
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
