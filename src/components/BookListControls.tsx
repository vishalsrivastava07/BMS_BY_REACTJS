import React from 'react';

interface BookListControlsProps {
  sortOrder: 'none' | 'asc' | 'desc';
  onSortChange: (order: 'none' | 'asc' | 'desc') => void;
  onShowAddBook: () => void;
  onClearFilters: () => void;
}

export const BookListControls: React.FC<BookListControlsProps> = ({
  onShowAddBook,
  onClearFilters,
}) => (
  <div className="flex flex-wrap justify-end gap-2">
    <button
      className="px-4 py-2 bg-green-500 text-white rounded text-lg hover:bg-green-600"
      onClick={onShowAddBook}
    >
      <span className="mr-2">➕</span>
      <span>Add New Book</span>
    </button>
    <button
      className="px-4 py-2 bg-yellow-500 text-white rounded text-lg hover:bg-yellow-600"
      onClick={onClearFilters}
    >
      <span className="mr-2">🔄</span>
      <span>Clear Filters</span>
    </button>
    
  </div>
);