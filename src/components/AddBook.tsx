import React, { useState, useEffect } from 'react';
import { Book } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AddBookProps {
  onAddBook: (book: Book) => void;
  editingBook: Book | null;
}

export const AddBook: React.FC<AddBookProps> = ({ onAddBook, editingBook }) => {
  const initialBookState = {
    id: '',
    title: '',
    author: '',
    isbn: '',
    publicationDate: '',
    genre: 'fiction' as const,
    price: 0,
    purchaseLink: '',
    bookType: 'Ebook' as const
  };

  const [book, setBook] = useState<Book>(initialBookState);
  const [errors, setErrors] = useState<Partial<Record<keyof Book, string>>>({});
// const [errors, setErrors] = useState<Map<keyof Book, string>>(new Map());


  // Set form values when editingBook changes
  useEffect(() => {
    if (editingBook) {
      setBook(editingBook);
    } else {
      setBook(initialBookState);
    }
  }, [editingBook]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Book, string>> = {};

    if (!book.title.trim()) newErrors.title = 'Title is required';
    if (!book.author.trim()) newErrors.author = 'Author is required';
    if (!book.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!book.publicationDate) newErrors.publicationDate = 'Publication date is required';
    if (book.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!book.purchaseLink.trim()) newErrors.purchaseLink = 'Purchase link is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submittingBook: Book = {
        ...book,
        id: editingBook ? editingBook.id : uuidv4()
      };
      onAddBook(submittingBook);
      setBook(initialBookState);
      setErrors({});
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="box" style={{ backgroundColor: '#f0f8ff' }}>
        <h1 className="title is-3 has-text-centered mb-5">
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className={`input ${errors.title ? 'is-danger' : ''}`}
                type="text"
                value={book.title}
                onChange={(e) => setBook({ ...book, title: e.target.value })}
                placeholder="Enter book title"
              />
            </div>
            {errors.title && <p className="help is-danger">{errors.title}</p>}
          </div>

          <div className="field">
            <label className="label">Author</label>
            <div className="control">
              <input
                className={`input ${errors.author ? 'is-danger' : ''}`}
                type="text"
                value={book.author}
                onChange={(e) => setBook({ ...book, author: e.target.value })}
                placeholder="Enter author name"
              />
            </div>
            {errors.author && <p className="help is-danger">{errors.author}</p>}
          </div>

          <div className="field">
            <label className="label">ISBN</label>
            <div className="control">
              <input
                className={`input ${errors.isbn ? 'is-danger' : ''}`}
                type="text"
                value={book.isbn}
                onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                placeholder="Enter ISBN"
              />
            </div>
            {errors.isbn && <p className="help is-danger">{errors.isbn}</p>}
          </div>

          <div className="field">
            <label className="label">Publication Date</label>
            <div className="control">
              <input
                className={`input ${errors.publicationDate ? 'is-danger' : ''}`}
                type="date"
                value={book.publicationDate}
                onChange={(e) => setBook({ ...book, publicationDate: e.target.value })}
              />
            </div>
            {errors.publicationDate && <p className="help is-danger">{errors.publicationDate}</p>}
          </div>

          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Genre</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={book.genre}
                      onChange={(e) => setBook({ ...book, genre: e.target.value as 'fiction' | 'non-fiction' })}
                    >
                      <option value="fiction">Fiction</option>
                      <option value="non-fiction">Non-Fiction</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="label">Book Type</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={book.bookType}
                      onChange={(e) => setBook({ ...book, bookType: e.target.value as 'Ebook' | 'printedBook' })}
                    >
                      <option value="Ebook">E-Book</option>
                      <option value="printedBook">Printed Book</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Price</label>
            <div className="control">
              <input
                className={`input ${errors.price ? 'is-danger' : ''}`}
                type="number"
                step="0.01"
                value={book.price}
                onChange={(e) => setBook({ ...book, price: parseFloat(e.target.value) })}
                placeholder="Enter price"
              />
            </div>
            {errors.price && <p className="help is-danger">{errors.price}</p>}
          </div>

          <div className="field">
            <label className="label">Purchase Link</label>
            <div className="control">
              <input
                className={`input ${errors.purchaseLink ? 'is-danger' : ''}`}
                type="url"
                value={book.purchaseLink}
                onChange={(e) => setBook({ ...book, purchaseLink: e.target.value })}
                placeholder="Enter purchase link"
              />
            </div>
            {errors.purchaseLink && <p className="help is-danger">{errors.purchaseLink}</p>}
          </div>

          <div className="field is-grouped is-grouped-centered mt-5">
            <div className="control">
              <button type="submit" className="button is-primary is-medium">
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
            </div>
            <div className="control">
              <button
                type="button"
                className="button is-light is-medium"
                onClick={() => {
                  setBook(initialBookState);
                  setErrors({});
                }}
              >
                Clear Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};