import React from 'react';

interface BookListHeaderProps {
  totalBooks: number;
  filteredCount: number;
}

export const BookListHeader: React.FC<BookListHeaderProps> = ({ totalBooks, filteredCount }) => (
  <div className="bg-blue-100 p-4 rounded mb-4">
    <p className="font-bold">Total Books: {totalBooks}</p>
    <p>Showing {filteredCount} books</p>
  </div>
);