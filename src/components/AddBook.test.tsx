import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AddBook from '../components/AddBook';
import booksReducer from '../components/redux/booksSlice';

const mockStore = configureStore({
  reducer: {
    books: booksReducer,
  },
});

describe('AddBook Component', () => {
  const mockOnAddBook = vi.fn();
  
  beforeEach(() => {
    mockOnAddBook.mockClear();
    render(
      <Provider store={mockStore}>
        <AddBook onAddBook={mockOnAddBook} editingBook={null} />
      </Provider>
    );
  });

  describe('Initial Render', () => {
    it('renders form with empty fields', () => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/author/i)).toHaveValue('');
      expect(screen.getByLabelText(/isbn/i)).toHaveValue('');
      expect(screen.getByLabelText(/publication date/i)).toHaveValue('');
      expect(screen.getByLabelText(/genre/i)).toHaveValue('fiction');
      expect(screen.getByLabelText(/book type/i)).toHaveValue('Ebook');
      expect(screen.getByLabelText(/price/i)).toHaveValue(0);
      expect(screen.getByLabelText(/purchase link/i)).toHaveValue('');
    });

    it('renders submit and clear buttons with correct text', () => {
      const submitButton = screen.getByRole('button', { name: /add book/i });
      const clearButton = screen.getByRole('button', { name: /clear form/i });
      
      expect(submitButton).toHaveTextContent('Add Book');
      expect(clearButton).toHaveTextContent('Clear Form');
    });
  });

  describe('Form Validation', () => {
    it('displays specific error messages for empty required fields', async () => {
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      const errors = await screen.findAllByText(/is required/i);
      expect(errors).toHaveLength(6); // Title, Author, ISBN, Publication date, Price, Purchase link

      const errorMessages = errors.map(error => error.textContent);
      expect(errorMessages).toContain('Title is required');
      expect(errorMessages).toContain('Author is required');
      expect(errorMessages).toContain('ISBN is required');
      expect(errorMessages).toContain('Publication date is required');
      expect(errorMessages).toContain('Purchase link is required');
    });

    it('validates ISBN format correctly', async () => {
      const isbnInput = screen.getByLabelText(/isbn/i);
      await userEvent.type(isbnInput, 'abc123');
      
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      const error = await screen.findByText('ISBN must contain only numbers');
      expect(error).toBeInTheDocument();
      expect(isbnInput).toHaveValue('123'); // Should only contain numbers
    });

    it('validates price must be positive', async () => {
      const priceInput = screen.getByLabelText(/price/i);
      await userEvent.type(priceInput, '-10.99');
      
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      const error = await screen.findByText('Price must be greater than 0');
      expect(error).toBeInTheDocument();
    });

    it('validates purchase link format', async () => {
      const purchaseLinkInput = screen.getByLabelText(/purchase link/i);
      await userEvent.type(purchaseLinkInput, 'invalid-url');
      
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      const error = await screen.findByText('Please enter a valid URL');
      expect(error).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('successfully submits form with valid data', async () => {
      const testData = {
        title: 'Test Book Title',
        author: 'Test Author Name',
        isbn: '1234567890',
        publicationDate: '2024-03-15',
        genre: 'fiction',
        bookType: 'Ebook',
        price: '29.99',
        purchaseLink: 'https://example.com/book'
      };

      // Fill in form fields
      await userEvent.type(screen.getByLabelText(/title/i), testData.title);
      await userEvent.type(screen.getByLabelText(/author/i), testData.author);
      await userEvent.type(screen.getByLabelText(/isbn/i), testData.isbn);
      await userEvent.type(screen.getByLabelText(/publication date/i), testData.publicationDate);
      await userEvent.type(screen.getByLabelText(/price/i), testData.price);
      await userEvent.type(screen.getByLabelText(/purchase link/i), testData.purchaseLink);

      // Verify input values
      expect(screen.getByLabelText(/title/i)).toHaveValue(testData.title);
      expect(screen.getByLabelText(/author/i)).toHaveValue(testData.author);
      expect(screen.getByLabelText(/isbn/i)).toHaveValue(testData.isbn);
      expect(screen.getByLabelText(/publication date/i)).toHaveValue(testData.publicationDate);
      expect(screen.getByLabelText(/genre/i)).toHaveValue(testData.genre);
      expect(screen.getByLabelText(/book type/i)).toHaveValue(testData.bookType);
      expect(screen.getByLabelText(/price/i)).toHaveValue(Number(testData.price));
      expect(screen.getByLabelText(/purchase link/i)).toHaveValue(testData.purchaseLink);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      // Verify onAddBook was called with correct data
      expect(mockOnAddBook).toHaveBeenCalledTimes(1);
      expect(mockOnAddBook).toHaveBeenCalledWith(expect.objectContaining({
        title: testData.title,
        author: testData.author,
        isbn: testData.isbn,
        publicationDate: testData.publicationDate,
        genre: testData.genre,
        bookType: testData.bookType,
        price: Number(testData.price),
        purchaseLink: testData.purchaseLink
      }));
    });
  });

  describe('Form Reset', () => {
    it('clears all form fields when Clear Form button is clicked', async () => {
      // Fill form with data
      await userEvent.type(screen.getByLabelText(/title/i), 'Test Title');
      await userEvent.type(screen.getByLabelText(/author/i), 'Test Author');
      await userEvent.type(screen.getByLabelText(/isbn/i), '1234567890');
      await userEvent.type(screen.getByLabelText(/publication date/i), '2024-03-15');
      await userEvent.type(screen.getByLabelText(/price/i), '29.99');
      await userEvent.type(screen.getByLabelText(/purchase link/i), 'https://example.com');

      // Click clear button
      const clearButton = screen.getByRole('button', { name: /clear form/i });
      fireEvent.click(clearButton);

      // Verify all fields are cleared
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/author/i)).toHaveValue('');
      expect(screen.getByLabelText(/isbn/i)).toHaveValue('');
      expect(screen.getByLabelText(/publication date/i)).toHaveValue('');
      expect(screen.getByLabelText(/genre/i)).toHaveValue('fiction');
      expect(screen.getByLabelText(/book type/i)).toHaveValue('Ebook');
      expect(screen.getByLabelText(/price/i)).toHaveValue(0);
      expect(screen.getByLabelText(/purchase link/i)).toHaveValue('');
    });

    it('clears error messages when form is reset', async () => {
      // Submit empty form to trigger errors
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      // Verify errors are shown
      expect(await screen.findAllByText(/is required/i)).toHaveLength(6);

      // Clear form
      const clearButton = screen.getByRole('button', { name: /clear form/i });
      fireEvent.click(clearButton);

      // Verify errors are cleared
      expect(screen.queryAllByText(/is required/i)).toHaveLength(0);
    });
  });
});