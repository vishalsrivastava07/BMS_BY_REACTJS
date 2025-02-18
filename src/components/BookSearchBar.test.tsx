import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BookSearchBar } from './BookSearchBar';
import booksReducer from '../components/redux/booksSlice';

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      books: booksReducer
    },
    preloadedState: {
      books: {
        searchTerm: '',
        genreFilter: 'all',
        ...initialState
      }
    }
  });
};

// Wrapper component to provide store context
const renderWithProvider = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store
  };
};

describe('BookSearchBar', () => {
  it('renders the search input and genre filter dropdown', () => {
    renderWithProvider(<BookSearchBar />);
    
    expect(screen.getByPlaceholderText('Search books...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All Genres' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Fiction' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Non-Fiction' })).toBeInTheDocument();
  });

  it('calls onSearchChange when input value changes', () => {
    const { store } = renderWithProvider(<BookSearchBar />);
    const searchInput = screen.getByPlaceholderText('Search books...');

    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(store.getState().books.searchTerm).toBe('test search');
  });

  it('calls onGenreChange when genre selection changes', () => {
    const { store } = renderWithProvider(<BookSearchBar />);
    const genreSelect = screen.getByRole('combobox');

    fireEvent.change(genreSelect, { target: { value: 'fiction' } });

    expect(store.getState().books.genreFilter).toBe('fiction');
  });
});