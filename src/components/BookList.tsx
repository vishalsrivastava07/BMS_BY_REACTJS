import React, { useState } from 'react';
import { Book } from './types';

export interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
  editingBook: Book | null;
  onShowAddBook: () => void;  // New prop for handling Add Book button click
}

export const BookList: React.FC<BookListProps> = ({ 
  books, 
  onDelete, 
  onEdit, 
  onShowAddBook 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [genreFilter, setGenreFilter] = useState<'all' | 'fiction' | 'non-fiction'>('all');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const clearAllFilters = () => {
    setSearchTerm('');
    setGenreFilter('all');
    setSortOrder('none');
  };

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;
      
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === 'desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <div className="p-4" style={{ 
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'auto'
    }}>
      <div className="box" style={{ margin: '0 auto', maxWidth: '1400px' }}>
        <div className="columns is-vcentered mb-4">
          <div className="column is-5">
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  className="input is-medium"
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="control">
                <div className="select is-medium">
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value as 'all' | 'fiction' | 'non-fiction')}
                  >
                    <option value="all">All Genres</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-7">
            <div className="buttons is-right">
              <button
                className="button is-success is-medium"
                onClick={onShowAddBook}
              >
                <span className="icon">➕</span>
                <span>Add New Book</span>
              </button>
              <button
                className="button is-warning is-medium"
                onClick={clearAllFilters}
              >
                <span className="icon">🔄</span>
                <span>Clear Filters</span>
              </button>
              <button
                className={`button is-medium ${sortOrder === 'asc' ? 'is-primary' : 'is-light'}`}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')}
              >
                <span className="icon">↑</span>
                <span>Sort A-Z</span>
              </button>
              <button
                className={`button is-medium ${sortOrder === 'desc' ? 'is-primary' : 'is-light'}`}
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')}
              >
                <span className="icon">↓</span>
                <span>Sort Z-A</span>
              </button>
            </div>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="notification is-info is-light">
            <p className="has-text-centered is-size-4">No books found matching your search criteria</p>
          </div>
        ) : (
          <>
            <div className="notification is-info is-light mb-4">
              <p className="has-text-weight-bold">Total Books: {books.length}</p>
              <p>Showing {filteredBooks.length} books</p>
            </div>
            <div className="table-container">
              <table className="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Book Type</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => (
                    <tr key={book.id} className="is-clickable">
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>
                        <span className={`tag ${book.genre === 'fiction' ? 'is-primary' : 'is-info'}`}>
                          {book.genre}
                        </span>
                      </td>
                      <td>
                        <span className={`tag ${book.bookType === 'Ebook' ? 'is-success' : 'is-warning'}`}>
                          {book.bookType}
                        </span>
                      </td>
                      <td>${book.price}</td>
                      <td>
                        <div className="buttons are-small">
                          <button
                            className="button is-info is-outlined"
                            onClick={() => onEdit(book)}
                          >
                            <span className="icon"></span>
                            <span>Edit</span>
                          </button>
                          <button
                            className="button is-danger is-outlined"
                            onClick={() => onDelete(book.id)}
                          >
                            <span className="icon"></span>
                            <span>Delete</span>
                          </button>
                          <button
                            className="button is-success is-outlined"
                            onClick={() => setSelectedBook(book)}
                          >
                            <span className="icon"></span>
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedBook && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setSelectedBook(null)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Book Details</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setSelectedBook(null)}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="content">
                <div className="box">
                  <p className="is-size-4 mb-4"><strong>{selectedBook.title}</strong></p>
                  <div className="field">
                    <label className="label">Author</label>
                    <p>{selectedBook.author}</p>
                  </div>
                  <div className="field">
                    <label className="label">ISBN</label>
                    <p>{selectedBook.isbn}</p>
                  </div>
                  <div className="field">
                    <label className="label">Publication Date</label>
                    <p>{selectedBook.publicationDate}</p>
                  </div>
                  <div className="field">
                    <label className="label">Genre</label>
                    <p>
                      <span className={`tag ${selectedBook.genre === 'fiction' ? 'is-primary' : 'is-info'}`}>
                        {selectedBook.genre}
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <label className="label">Book Type</label>
                    <p>
                      <span className={`tag ${selectedBook.bookType === 'Ebook' ? 'is-success' : 'is-warning'}`}>
                        {selectedBook.bookType}
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <label className="label">Price</label>
                    <p className="has-text-weight-bold is-size-5">${selectedBook.price}</p>
                  </div>
                  <div className="field">
                    <label className="label">Purchase Link</label>
                    <p>
                      <a href={selectedBook.purchaseLink} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="button is-link is-outlined">
                        <span className="icon">🛒</span>
                        <span>Buy Now</span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};