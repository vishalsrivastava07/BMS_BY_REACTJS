import React from 'react';
import { Book } from './types';

interface BookTableRowProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onShowDetails: (book: Book) => void;
}

export const BookTableRow: React.FC<BookTableRowProps> = ({
  book,
  onEdit,
  onDelete,
  onShowDetails,
}) => (
  <tr className="hover:bg-gray-50 border-t">
    <td className="p-4">{book.title}</td>
    <td className="p-4">{book.author}</td>
    <td className="p-4">{book.isbn}</td>
    <td className="p-4">
        {book.genre}
    </td>
    <td className="p-4">{book.bookType}</td>
    <td className="p-4">${book.price}</td>
    <td className="p-4">
      <div className="flex gap-2">
        <button
          className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          onClick={() => onEdit(book)}
        >
          Edit
        </button>
        <button
          className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
          onClick={() => onDelete(book.id)}
        >
          Delete
        </button>
        <button
          className="px-3 py-1 text-sm border border-green-500 text-green-500 rounded hover:bg-green-50"
          onClick={() => onShowDetails(book)}
        >
          Details
        </button>
      </div>
    </td>
  </tr>
);