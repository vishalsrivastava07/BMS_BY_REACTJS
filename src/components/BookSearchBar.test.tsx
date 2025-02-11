import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookSearchBar } from './BookSearchBar';

describe('BookSearchBar', () => {
  it('renders the search input and genre filter dropdown', () => {
    render(
      <BookSearchBar 
        searchTerm="" 
        genreFilter="all" 
        onSearchChange={() => {}} 
        onGenreChange={() => {}} 
      />
    );

    expect(screen.getByPlaceholderText('Search books...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onSearchChange when input value changes', () => {
    const onSearchChange = vi.fn();
    render(
      <BookSearchBar 
        searchTerm="" 
        genreFilter="all" 
        onSearchChange={onSearchChange} 
        onGenreChange={() => {}} 
      />
    );

    const input = screen.getByPlaceholderText('Search books...');
    fireEvent.change(input, { target: { value: 'React' } });
    expect(onSearchChange).toHaveBeenCalledWith('React');
  });

  it('calls onGenreChange when genre selection changes', () => {
    const onGenreChange = vi.fn();
    render(
      <BookSearchBar 
        searchTerm="" 
        genreFilter="all" 
        onSearchChange={() => {}} 
        onGenreChange={onGenreChange} 
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'fiction' } });
    expect(onGenreChange).toHaveBeenCalledWith('fiction');
  });
});
