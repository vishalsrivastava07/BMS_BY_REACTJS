import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BookListControls } from './BookListControls';
import booksReducer from './redux/booksSlice';

// Setup store for testing
const createTestStore = () => {
  return configureStore({
    reducer: {
      books: booksReducer,
    },
  });
};

describe('BookListControls', () => {
  it('renders both buttons correctly', () => {
    const mockShowAddBook = vi.fn();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <BookListControls onShowAddBook={mockShowAddBook} />
      </Provider>
    );

    expect(screen.getByText('Add New Book')).toBeInTheDocument();
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('calls onShowAddBook when Add New Book button is clicked', () => {
    const mockShowAddBook = vi.fn();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <BookListControls onShowAddBook={mockShowAddBook} />
      </Provider>
    );

    const addButton = screen.getByText('Add New Book');
    fireEvent.click(addButton);

    expect(mockShowAddBook).toHaveBeenCalledTimes(1);
  });

  it('dispatches clearFilters action when Clear Filters button is clicked', async () => {
    const mockShowAddBook = vi.fn();
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <BookListControls onShowAddBook={mockShowAddBook} />
      </Provider>
    );

    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'books/clearFilters'
    }));
  });

  it('applies correct styling to buttons', () => {
    const mockShowAddBook = vi.fn();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <BookListControls onShowAddBook={mockShowAddBook} />
      </Provider>
    );

    const addButton = screen.getByText('Add New Book').closest('button');
    const clearButton = screen.getByText('Clear Filters').closest('button');

    expect(addButton).toHaveClass('bg-green-500');
    expect(clearButton).toHaveClass('bg-yellow-500');
  });
});