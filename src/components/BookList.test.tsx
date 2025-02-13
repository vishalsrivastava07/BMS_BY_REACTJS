import { expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookList } from './BookList';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../components/redux/booksSlice';

// Mock data
const mockBooks = [
  {
    id: '1',
    title: 'Test Book 1',
    author: 'Author 1',
    isbn: '123-456-789',
    genre: 'Fiction',
    bookType: 'Hardcover',
    price: 29.99
  },
  {
    id: '2',
    title: 'Test Book 2',
    author: 'Author 2',
    isbn: '987-654-321',
    genre: 'Non-Fiction',
    bookType: 'Paperback',
    price: 19.99
  }
];

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Setup store for testing
const createTestStore = () => configureStore({
  reducer: {
    books: booksReducer
  }
});

// Test wrapper component
const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store
  };
};

describe('BookList Component', () => {
  const mockShowAddBook = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.setItem.mockReset();
  });

  test('renders empty state when no books are available', () => {
    renderWithProviders(<BookList books={[]} onShowAddBook={mockShowAddBook} />);
    expect(screen.getByText('No books found matching your search criteria')).toBeInTheDocument();
  });

  test('renders book list with provided books', () => {
    renderWithProviders(<BookList books={[mockBooks]} onShowAddBook={mockShowAddBook} />);
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
  });

  test('handles book deletion', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockBooks));
    renderWithProviders(<BookList books={mockBooks} onShowAddBook={mockShowAddBook} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]);
    
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const updatedBooks = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
    expect(updatedBooks).not.toContainEqual(mockBooks[0]);
  });

  test('handles book editing', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockBooks));
    renderWithProviders(<BookList books={mockBooks} onShowAddBook={mockShowAddBook} />);
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await userEvent.click(editButtons[0]);
    
    // Assuming there's an edit form that appears
    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Book Title');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
    
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const updatedBooks = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
    expect(updatedBooks[0].title).toBe('Updated Book Title');
  });

  test('handles sorting by different fields', async () => {
    renderWithProviders(<BookList books={mockBooks} onShowAddBook={mockShowAddBook} />);
    
    // Test sorting by title
    const titleHeader = screen.getByText('Title');
    await userEvent.click(titleHeader);
    
    // First click should sort ascending
    let books = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(books[0]).toHaveTextContent('Test Book 1');
    expect(books[1]).toHaveTextContent('Test Book 2');
    
    // Second click should sort descending
    await userEvent.click(titleHeader);
    books = screen.getAllByRole('row').slice(1);
    expect(books[0]).toHaveTextContent('Test Book 2');
    expect(books[1]).toHaveTextContent('Test Book 1');
  });

  test('handles search functionality', async () => {
    renderWithProviders(<BookList books={mockBooks} onShowAddBook={mockShowAddBook} />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'Test Book 1');
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
  });

  test('handles genre filtering', async () => {
    renderWithProviders(<BookList books={mockBooks} onShowAddBook={mockShowAddBook} />);
    
    const genreSelect = screen.getByLabelText(/genre/i);
    await userEvent.selectOptions(genreSelect, 'Fiction');
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
  });

  test('shows book details modal when clicking view details', async () => {
    renderWithProviders(<BookList books={mockBooks} onShowAddBook={mockShowAddBook} />);
    
    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    await userEvent.click(viewDetailsButtons[0]);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});