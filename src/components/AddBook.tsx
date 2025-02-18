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
    bookType: 'Ebook' as const,
    description: ''
  };

  const [book, setBook] = useState<Book>(initialBookState);
  const [errors, setErrors] = useState<Partial<Record<keyof Book, string>>>({});

  useEffect(() => {
    if (editingBook) {
      setBook(editingBook);
    } else {
      setBook(initialBookState);
    }
  }, [editingBook]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Book, string>> = {};

    if (!book.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!book.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!book.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!/^\d+$/.test(book.isbn)) {
      newErrors.isbn = 'ISBN must contain only numbers';
    }

    if (!book.publicationDate) {
      newErrors.publicationDate = 'Publication date is required';
    }

    const priceNum = Number(book.price);
    if (!book.price || priceNum <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!book.purchaseLink.trim()) {
      newErrors.purchaseLink = 'Purchase link is required';
    } else if (!/^https?:\/\/\S+$/.test(book.purchaseLink)) {
      newErrors.purchaseLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submittingBook: Book = {
        ...book,
        id: book.id || uuidv4(),
        price: Number(book.price)
      };
      onAddBook(submittingBook);
      handleClearForm();
    }
  };

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBook({ ...book, isbn: value });
    if (errors.isbn) {
      setErrors({ ...errors, isbn: '' });
    }
  };
  const handlePurchaseLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBook({ ...book, purchaseLink: value });
    if (errors.purchaseLink) {
      setErrors({ ...errors, purchaseLink: '' });
    }
  };

  const handleClearForm = () => {
    setBook(initialBookState);
    setErrors({});
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-blue-50 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
              placeholder="Enter book title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              id="author"
              className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              value={book.author}
              onChange={(e) => setBook({ ...book, author: e.target.value })}
              placeholder="Enter author name"
            />
            {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
          </div>

          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
              ISBN <span className="text-red-500">*</span>
            </label>
            <input
              id="isbn"
              className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.isbn ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              value={book.isbn}
              onChange={handleIsbnChange}
              placeholder="Enter ISBN (numbers only)"
            />
            {errors.isbn && <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>}
          </div>

          <div>
            <label htmlFor="publicationDate" className="block text-sm font-medium text-gray-700 mb-1">
              Publication Date <span className="text-red-500">*</span>
            </label>
            <input
              id="publicationDate"
              className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.publicationDate ? 'border-red-500' : 'border-gray-300'
              }`}
              type="date"
              value={book.publicationDate}
              onChange={(e) => setBook({ ...book, publicationDate: e.target.value })}
            />
            {errors.publicationDate && <p className="mt-1 text-sm text-red-600">{errors.publicationDate}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                id="genre"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                value={book.genre}
                onChange={(e) => setBook({ ...book, genre: e.target.value as 'fiction' | 'non-fiction' })}
              >
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
              </select>
            </div>

            <div>
              <label htmlFor="bookType" className="block text-sm font-medium text-gray-700 mb-1">
                Book Type <span className="text-red-500">*</span>
              </label>
              <select
                id="bookType"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                value={book.bookType}
                onChange={(e) => setBook({ ...book, bookType: e.target.value as 'Ebook' | 'Printedbook' })}
              >
                <option value="Ebook">E-Book</option>
                <option value="Printedbook">Printed Book</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              type="number"
              step="0.01"
              min="0"
              value={book.price}
              onChange={(e) => setBook({ ...book, price: Number(e.target.value) })}
              placeholder="Enter price"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="purchaseLink" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Link <span className="text-red-500">*</span>
            </label>
            <input
              id="purchaseLink"
              className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.purchaseLink ? 'border-red-500' : 'border-gray-300'
              }`}
              type="url"
              value={book.purchaseLink}
              onChange={handlePurchaseLinkChange}
              placeholder="Enter purchase link"
            />
            {errors.purchaseLink && <p className="mt-1 text-sm text-red-600">{errors.purchaseLink}</p>}
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingBook ? 'Update Book' : 'Add Book'}
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={handleClearForm}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;