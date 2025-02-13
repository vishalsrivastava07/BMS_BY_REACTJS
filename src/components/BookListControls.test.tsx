import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookListControls } from './BookListControls';

describe('BookListControls Component', () => {
  it('calls onShowAddBook when Add New Book button is clicked', () => {
    const onShowAddBook = vi.fn();
    const onClearFilters = vi.fn();

    render(
      <BookListControls 
            onShowAddBook={onShowAddBook}
            onClearFilters={onClearFilters} sortOrder={'none'} onSortChange={function (_order: 'none' | 'asc' | 'desc'): void {
                throw new Error('Function not implemented.');
            } }      />
    );

    const addButton = screen.getByText(/Add New Book/i);
    fireEvent.click(addButton);
    expect(onShowAddBook).toHaveBeenCalled();
  });

  it('calls onClearFilters when Clear Filters button is clicked', () => {
    const onShowAddBook = vi.fn();
    const onClearFilters = vi.fn();

    render(
      <BookListControls 
            onShowAddBook={onShowAddBook}
            onClearFilters={onClearFilters} sortOrder={'none'} onSortChange={function (_order: 'none' | 'asc' | 'desc'): void {
                throw new Error('Function not implemented.');
            } }      />
    );

    const clearButton = screen.getByText(/Clear Filters/i);
    fireEvent.click(clearButton);
    expect(onClearFilters).toHaveBeenCalled();
  });
});
