import React, { useState } from 'react';
import { BookList } from './components/BookList';
import { AddBook } from './components/AddBook';
import {Book} from './components/types'

const App: React.FC = () => {
  // State management
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Handler for adding or updating a book
  const handleAddBook = (newBook: Book) => {
    if (editingBook) {
      // Update existing book
      setBooks(books.map(book => 
        book.id === editingBook.id ? newBook : book
      ));
      setEditingBook(null);
    } else {
      // Add new book
      setBooks([...books, newBook]);
    }
    setShowAddBook(false);
  };

  // Handler for editing a book
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowAddBook(true);
  };

  // Handler for deleting a book
  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
  };

  // Handler for showing the add book form
  const handleShowAddBook = () => {
    setShowAddBook(true);
    setEditingBook(null);
  };

  return (
    <div className="container is-fluid">
      {showAddBook ? (
        <>
          <div className="buttons m-4">
            <button
              className="button is-info"
              onClick={() => setShowAddBook(false)}
            >
              <span className="icon">←</span>
              <span>Back to Book List</span>
            </button>
          </div>
          <AddBook
            onAddBook={handleAddBook}
            editingBook={editingBook}
          />
        </>
      ) : (
        <BookList
          books={books}
          onDelete={handleDeleteBook}
          onEdit={handleEditBook}
          editingBook={editingBook}
          onShowAddBook={handleShowAddBook}
        />
      )}
    </div>
  );
};

export default App;