import React from 'react';
import { Book } from './types';

interface BookDetailsModalProps {
  book: Book;
  onClose: () => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg w-full max-w-2xl">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-xl font-semibold">Book Details</h3>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="p-4">
        <div className="bg-gray-50 p-6 rounded">
          <p className="text-2xl font-bold mb-4">{book.title}</p>
          <div className="space-y-4">
            <DetailRow label="Author" value={book.author} />
            <DetailRow label="ISBN" value={book.isbn} />
            <DetailRow label="Publication Date" value={book.publicationDate} />
            <DetailRow 
              label="Genre" 
              value={book.genre}
              className={`px-2 py-1 rounded-full text-sm ${
                book.genre === 'fiction'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            />
            <DetailRow 
              label="Book Type" 
              value={book.bookType}
              className={`px-2 py-1 rounded-full text-sm ${
                book.bookType === 'Ebook'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            />
            <DetailRow label="Price" value={`$${book.price}`} />
            <div>
              <label className="font-semibold block">Purchase Link</label>
              <a
                href={book.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                <span className="mr-2">🛒</span>
                <span>Buy Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface DetailRowProps {
  label: string;
  value: string;
  className?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, className }) => (
  <div>
    <label className="font-semibold block">{label}</label>
    {className ? (
      <span className={className}>{value}</span>
    ) : (
      <p>{value}</p>
    )}
  </div>
);