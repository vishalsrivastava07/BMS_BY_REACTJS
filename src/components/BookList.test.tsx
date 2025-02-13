import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BookList } from './BookList';
import booksReducer from '../components/redux/booksSlice';
import type { Book } from './types';

// Mock data
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Vishal',
    author: 'sriv',
    isbn: '9',
    genre: 'fiction',
    bookType: 'Ebook',
    price: 1,
    description: 'A tory',
    purchaseLink: '',
    publicationDate: ''
  },
  {
    id: '2',
    title: '1984',
    author: 'vis',
    isbn: '9',
    genre: 'fiction',
    bookType: 'Ebook',
    price: 12,
    description: 'A novel.',
    purchaseLink: '',
    publicationDate: ''
  }
];

// Helper function to get cell content by row and column
const getCellContent = (row: HTMLElement, columnIndex: number): string => {
  const cells = within(row).getAllByRole('cell');
  return cells[columnIndex].textContent || '';
};

const setupComponent = (initialBooks = mockBooks) => {
  const store = configureStore({
    reducer: {
      books: booksReducer
    },
    preloadedState: {
      books: {
        items: [],
        searchTerm: '',
        genreFilter: 'all',
        sortField: 'title',
        sortDirection: 'none',
        selectedBook: null
      }
    }
  });

  return {
    user: userEvent.setup(),
    ...render(
      <Provider store={store}>
        <BookList books={initialBooks} onShowAddBook={() => {}} />
      </Provider>
    ),
    store
  };
};

describe('BookList Component', () => {
  beforeEach(() => {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn()
    };
    global.localStorage = localStorageMock as any;
  });

  describe('Rendering', () => {
    it('should render the component with correct initial book data', () => {
      setupComponent();
      const rows = screen.getAllByRole('row');
      
      // Verify first book's data
      const firstBookRow = rows[1];
      expect(getCellContent(firstBookRow, 0)).toBe('The Great Vishal');
      expect(getCellContent(firstBookRow, 1)).toBe('F. Scott Fitzgerald');
      expect(getCellContent(firstBookRow, 2)).toBe('978-0743273565');
      expect(getCellContent(firstBookRow, 3)).toBe('fiction');
      expect(getCellContent(firstBookRow, 4)).toBe('hardcover');
      expect(getCellContent(firstBookRow, 5)).toBe('15.99');

      // Verify second book's data
      const secondBookRow = rows[2];
      expect(getCellContent(secondBookRow, 0)).toBe('1984');
      expect(getCellContent(secondBookRow, 1)).toBe('George Orwell');
      expect(getCellContent(secondBookRow, 2)).toBe('978-0451524935');
      expect(getCellContent(secondBookRow, 3)).toBe('fiction');
      expect(getCellContent(secondBookRow, 4)).toBe('paperback');
      expect(getCellContent(secondBookRow, 5)).toBe('12.99');
    });

    it('should display exact "No books found" message when no books match filter', async () => {
      const { user } = setupComponent();
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'nonexistent book');
      
      const noBooksMessage = screen.getByText('No books found matching your search criteria');
      expect(noBooksMessage).toHaveTextContent('No books found matching your search criteria');
      expect(noBooksMessage.tagName.toLowerCase()).toBe('p');
      expect(noBooksMessage).toHaveClass('text-center', 'text-xl');
    });
  });

  describe('Sorting', () => {
    it('should sort books by title in ascending order with correct order', async () => {
      const { user } = setupComponent();
      const titleHeader = screen.getByText(/^Title/);
      
      await user.click(titleHeader);
      
      const rows = screen.getAllByRole('row');
      expect(getCellContent(rows[1], 0)).toBe('1984');
      expect(getCellContent(rows[2], 0)).toBe('The Great Vishal');
    });

    it('should sort books by price in descending order with correct values', async () => {
      const { user } = setupComponent();
      const priceHeader = screen.getByText(/^Price/);
      
      // Click twice for descending order
      await user.click(priceHeader);
      await user.click(priceHeader);
      
      const rows = screen.getAllByRole('row');
      expect(parseFloat(getCellContent(rows[1], 5))).toBe(15.99);
      expect(parseFloat(getCellContent(rows[2], 5))).toBe(12.99);
    });

    it('should sort books by author with correct alphabetical order', async () => {
      const { user } = setupComponent();
      const authorHeader = screen.getByText(/^Author/);
      
      await user.click(authorHeader);
      
      const rows = screen.getAllByRole('row');
      expect(getCellContent(rows[1], 1)).toBe('F. Scott Fitzgerald');
      expect(getCellContent(rows[2], 1)).toBe('George Orwell');
    });
  });

  describe('Filtering', () => {
    it('should filter books by search term and show exact matches', async () => {
      const { user } = setupComponent();
      const searchInput = screen.getByPlaceholderText(/search/i);
      
      await user.type(searchInput, 'Vishal');
      
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // Header + 1 matching book
      expect(getCellContent(rows[1], 0)).toBe('The Great Vishal');
      expect(getCellContent(rows[1], 1)).toBe('F. Scott Fitzgerald');
    });
  });

  describe('CRUD Operations', () => {
    it('should remove exactly one book when delete button is clicked', async () => {
      const { user } = setupComponent();
      const initialRows = screen.getAllByRole('row');
      const initialCount = initialRows.length;
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);
      
      const remainingRows = screen.getAllByRole('row');
      expect(remainingRows.length).toBe(initialCount - 1);
      expect(getCellContent(remainingRows[1], 0)).toBe('1984');
    });
  });

  describe('Local Storage', () => {
    it('should load exact book data from localStorage on mount', () => {
      const storedBooks = [...mockBooks];
      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(storedBooks));
      
      setupComponent([]);
      
      const rows = screen.getAllByRole('row');
      expect(rows.length - 1).toBe(storedBooks.length); // Subtract header row
      
      storedBooks.forEach((book, index) => {
        const row = rows[index + 1]; // +1 to skip header
        expect(getCellContent(row, 0)).toBe(book.title);
        expect(getCellContent(row, 1)).toBe(book.author);
        expect(getCellContent(row, 2)).toBe(book.isbn);
      });
    });

    it('should save exact book data to localStorage when deleting', async () => {
      const { user } = setupComponent();
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      
      await user.click(deleteButtons[0]);
      
      const expectedBooks = mockBooks.slice(1); // Remove first book
      expect(localStorage.setItem).toHaveBeenCalledWith('books', JSON.stringify(expectedBooks));
    });
  });
});