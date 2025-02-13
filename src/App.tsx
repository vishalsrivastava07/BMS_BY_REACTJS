import React, { useState } from 'react';
import { BookList } from './components/BookList';
import { AddBook } from './components/AddBook';
import { Book } from './components/types';
import './styles.css';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleAddBook = (newBook: Book) => {
    if (editingBook) {
      setBooks(books.map(book => 
        book.id === editingBook.id ? newBook : book
      ));
      setEditingBook(null);
    } else {
      setBooks([...books, newBook]);
    }
    setShowAddBook(false);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowAddBook(true);
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handleShowAddBook = () => {
    setShowAddBook(true);
    setEditingBook(null);
  };

  return (
    <div className="container mx-auto px-4">
      {showAddBook ? (
        <>
          <div className="flex space-x-4 m-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              onClick={() => setShowAddBook(false)}
            >
              <span className="mr-2">←</span>
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