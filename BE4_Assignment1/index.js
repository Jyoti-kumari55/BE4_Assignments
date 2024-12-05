require('./dbConnect');
const Book = require('./bookModel');
const express = require('express');
const app = express();

app.use(express.json());

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send("Hello Jyoti!")
});

// Create a new book in the database
async function createBook(newBook){
  try {
    const book = new Book(newBook)
    const saveBook = await book.save();
    return saveBook;
  }catch (error){
    throw error;
  }
}
app.post('/books', async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    res.status(200).json({message: "Book added successfully", book: savedBook})
  } catch(error){
    console.error('Error occurred:', error);
    res.status(500).json({ error: "Failed to add new Book."})
  }
});

// Get all the books present in the database
async function readAllBooks() {
  try {
    const allBooks = await Book.find();
    return allBooks;
  }catch (error){
    throw error;
  }
}

app.get('/books', async (req, res) => {
  try {
    const books = await readAllBooks();
    if(books.length != 0){
      res.json(books);
    }else {
      res.status(404).json({ error: "No book found."})
    }
    
  }catch (error) {
    console.log('Error occurred: ', error);
    res.status(500).json({error: 'Failed to add new Book.'})
  }
})

//Get books details by its title
async function readBooksByTitle(bookTitle){
  try {
    const bookByTitle = await Book.findOne({title: bookTitle})
    return bookByTitle;
  }catch(error){
    throw error;
  }
}
app.get('/books/title/:bookTitle', async (req, res) => {
  try {
    const books = await readBooksByTitle(req.params.bookTitle);
    if(books.length != 0){
      res.json(books)
    }else {
      res.status(404).json({ error: "No book found."})
    }
  }catch(error){
    console.log('Error Occurred: ', error );
    res.status(500).json({error: 'Failed to get Book'})
  }
})

async function readBooksByAuthor(authorName){
  try {
    const bookByAuthor = await Book.find({author: authorName})
    return bookByAuthor;
  }catch (error){
    throw error;
  }
}
app.get('/books/author/:authorName', async (req, res) => {
  try {
    const books = await readBooksByAuthor(req.params.authorName)
    if(books.length != 0){
      res.json(books)
    }else {
      res.status(404).json({ error: 'Book not found.'})
    }   
  } catch(error) {
    res.status(500).json({ error: 'Failed to get book.'})
  }
});

async function readBooksByGenre(genreName){
  try {
    const bookByGenre = await Book.find({genre: genreName})
    return bookByGenre
  }catch(error){
    throw error;
  }
}
app.get('/books/genre/:bookgenre', async (req, res) => {
  try {
    const books = await readBooksByGenre(req.params.bookgenre)
    if(books != 0){
      res.json(books)
    }else {
    res.status(404).json({ error: 'Book not found.'})
  }   
  } catch(error) {
  res.status(500).json({ error: 'Failed to get book.'})
  }
});

async function readBookByReleaseYear(bookYear){
  try{
    const bookByYear = await Book.find({publishedYear: bookYear});
    return bookByYear;
  }catch(error){
    throw error;
  }
}
app.get('/books/year/:bookYear', async (req, res) => {
  try {
    const books = await readBookByReleaseYear(req.params.bookYear);
    if(books != 0){
      res.json(books)
    }else {
    res.status(404).json({ error: 'Book not found.'})
    }   
    } catch(error) {
    res.status(500).json({ error: 'Failed to get book.'})
    }
});

async function updateBook(bookId, dataToUpdate) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true});
    return updatedBook
  }catch(error){
    console.log('Error in updating book rating.', error)
  }
}
app.post('/books/:bookId', async (req, res) => {
  try {
    const bookUpdated = await updateBook(req.params.bookId, req.body);
    if(bookUpdated){
      res.status(200).json({ message:  "Book updated successfully,", book: bookUpdated})
    }else {
    res.status(404).json({ error: "Book does not exist."})
  }
  }catch(error){
  res.status(500).json({error: "Failed to update book."})
  }
});

async function updateBookByTitle(bookTitle, dataToBeUpdate){
  try {
    const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToBeUpdate, {new: true});
    return updatedBook
  }catch(error){
    console.log('Error in updating book rating.', error)
  }
};
app.post('/books/title/:bookTitle', async (req, res) => {
  try {
  const bookUpdated = await updateBookByTitle(req.params.bookTitle, req.body);
    if(bookUpdated){
      res.status(200).json({ message:"Book updated successfully,", book: bookUpdated})
    }else {
    res.status(404).json({ error: "Book does not exist."})
  }
  }catch(error){
  res.status(500).json({error: "Failed to update book."})
  }
})

async function deleteBook(bookId){
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return deletedBook
  }catch (error){
    console.log(error)
  }
}
app.delete('/books/:booksId', async (req, res) => {
  try {
    const bookToBeDeleted = await deleteBook(req.params.booksId);
    if(bookToBeDeleted){
      res.status(200).json({message: "Book deleted successfully,", book: bookToBeDeleted})
    }  else {
      res.status(404).json({error: "Book not found."})
    }
  }catch (error){
    res.status(500).json({ error: "Failed to delete Book."})
  }
})
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}.`);
})