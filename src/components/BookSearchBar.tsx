import React from 'react';
import { useAppDispatch, useAppSelector } from '../components/redux/hooks';
import { setSearchTerm, setGenreFilter } from '../components/redux/booksSlice';

export const BookSearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, genreFilter } = useAppSelector((state: { books: any; }) => state.books);

  return (
    <div className="flex">
      <input
        className="flex-1 px-4 py-2 border rounded-l text-lg"
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
      />
      <select
        className="px-4 py-2 border-l-0 border text-lg rounded-r bg-white"
        value={genreFilter}
        onChange={(e) => dispatch(setGenreFilter(e.target.value as 'all' | 'fiction' | 'non-fiction'))}
      >
        <option value="all">All Genres</option>
        <option value="fiction">Fiction</option>
        <option value="non-fiction">Non-Fiction</option>
      </select>
    </div>
  );
};