import React from 'react';

interface BookSearchBarProps {
  searchTerm: string;
  genreFilter: 'all' | 'fiction' | 'non-fiction';
  onSearchChange: (value: string) => void;
  onGenreChange: (value: 'all' | 'fiction' | 'non-fiction') => void;
}

export const BookSearchBar: React.FC<BookSearchBarProps> = ({
  searchTerm,
  genreFilter,
  onSearchChange,
  onGenreChange,
}) => (
  <div className="flex">
    <input
      className="flex-1 px-4 py-2 border rounded-l text-lg"
      type="text"
      placeholder="Search books..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <select
      className="px-4 py-2 border-l-0 border text-lg rounded-r bg-white"
      value={genreFilter}
      onChange={(e) => onGenreChange(e.target.value as 'all' | 'fiction' | 'non-fiction')}
    >
      <option value="all">All Genres</option>
      <option value="fiction">Fiction</option>
      <option value="non-fiction">Non-Fiction</option>
    </select>
  </div>
);
