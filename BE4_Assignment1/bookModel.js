const mongoose = require("mongoose")

const bookDetails = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  genre: [{
    type: String,
    enum: [ 'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Science-Fiction', 'Fantasy', 'Romance', 'Historical', 'Business', 'Biography', 'Horror', 'Action', 'Autobiography', 'Self-help', 'Other']
  }],
  language: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: "United States"
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  summary: String,
  coverUmageUrl: String

}, { timestamps: true });

const Book = mongoose.model("Book", bookDetails)

module.exports = Book