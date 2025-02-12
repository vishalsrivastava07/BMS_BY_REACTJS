import { expect, test, describe, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { AddBook } from './AddBook';
import { Book } from './types';

describe('AddBook Component', () => {
  const sampleBook: Book = {
      title: 'Book',
      author: 'Author',
      isbn: '1',
      publicationDate: '01-02-2032',
      genre: 'fiction',
      price: 15,
      purchaseLink: 'https://www.x.com',
      bookType: 'Ebook',
      id: ''
  };

  const mockOnAddBook = vi.fn();

  const fillForm = async (container: HTMLElement, book: Partial<Book> = sampleBook) => {
    if (book.title) {
      await fireEvent.change(container.querySelector('input[placeholder="Enter book title"]')!, {
        target: { value: book.title }
      });
    }
    if (book.author) {
      await fireEvent.change(container.querySelector('input[placeholder="Enter author name"]')!, {
        target: { value: book.author }
      });
    }
    if (book.isbn) {
      await fireEvent.change(container.querySelector('input[placeholder="Enter ISBN (numbers only)"]')!, {
        target: { value: book.isbn }
      });
    }
    if (book.publicationDate) {
      await fireEvent.change(container.querySelector('input[type="date"]')!, {
        target: { value: book.publicationDate }
      });
    }
    if (book.genre) {
      await fireEvent.change(container.querySelector('select[value="fiction"]')!, {
        target: { value: book.genre }
      });
    }
    if (book.bookType) {
      await fireEvent.change(container.querySelector('select[value="Ebook"]')!, {
        target: { value: book.bookType }
      });
    }
    if (book.price) {
      await fireEvent.change(container.querySelector('input[type="number"]')!, {
        target: { value: book.price.toString() }
      });
    }
    if (book.purchaseLink) {
      await fireEvent.change(container.querySelector('input[type="url"]')!, {
        target: { value: book.purchaseLink }
      });
    }
  };

  test('renders form with all fields', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    expect(container.querySelector('input[placeholder="Enter book title"]')).toBeTruthy();
    expect(container.querySelector('input[placeholder="Enter author name"]')).toBeTruthy();
    expect(container.querySelector('input[placeholder="Enter ISBN (numbers only)"]')).toBeTruthy();
    expect(container.querySelector('input[type="date"]')).toBeTruthy();
    expect(container.querySelector('select[value="fiction"]')).toBeTruthy();
    expect(container.querySelector('select[value="Ebook"]')).toBeTruthy();
    expect(container.querySelector('input[type="number"]')).toBeTruthy();
    expect(container.querySelector('input[type="url"]')).toBeTruthy();
  });

  test('submited successfully', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    await fillForm(container);
    
    const submitButton = container.querySelector('button[type="submit"]')!;
    await fireEvent.click(submitButton);
    
    expect(mockOnAddBook).toHaveBeenCalledTimes(1);
    expect(mockOnAddBook).toHaveBeenCalledWith(expect.objectContaining({
      title: sampleBook.title,
      author: sampleBook.author,
      isbn: sampleBook.isbn,
      publicationDate: sampleBook.publicationDate,
      genre: sampleBook.genre,
      price: sampleBook.price,
      purchaseLink: sampleBook.purchaseLink,
      bookType: sampleBook.bookType
    }));
  });

  test('shows validation errors for empty fields', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    const submitButton = container.querySelector('button[type="submit"]')!;
    await fireEvent.click(submitButton);
    
    expect(container.querySelector('p.text-red-600')).toBeTruthy();
    expect(mockOnAddBook).not.toHaveBeenCalled();
  });

  test('validates ISBN format', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    await fillForm(container, {
      ...sampleBook,
      isbn: 'invalid-isbn'
    });
    
    const submitButton = container.querySelector('button[type="submit"]')!;
    await fireEvent.click(submitButton);
    
    expect(container.querySelector('p.text-red-600')).toBeTruthy();
    expect(mockOnAddBook).not.toHaveBeenCalled();
  });

  test('validates price is greater than 0', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    await fillForm(container, {
      ...sampleBook,
      price: -1
    });
    
    const submitButton = container.querySelector('button[type="submit"]')!;
    await fireEvent.click(submitButton);
    
    expect(container.querySelector('p.text-red-600')).toBeTruthy();
    expect(mockOnAddBook).not.toHaveBeenCalled();
  });

  test('validates purchase link format', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    await fillForm(container, {
      ...sampleBook,
      purchaseLink: 'invalid-url'
    });
    
    const submitButton = container.querySelector('button[type="submit"]')!;
    await fireEvent.click(submitButton);
    
    expect(container.querySelector('p.text-red-600')).toBeTruthy();
    expect(mockOnAddBook).not.toHaveBeenCalled();
  });

  test('clears form on successful submission', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    await fillForm(container);
    
    const submitButton = container.querySelector('button[type="submit"]')!;
    await fireEvent.click(submitButton);
    
    expect(container.querySelector('input[placeholder="Enter book title"]')?.getAttribute('value')).toBe('');
    expect(container.querySelector('input[placeholder="Enter author name"]')?.getAttribute('value')).toBe('');
  });

  test('loads editing book data correctly', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={sampleBook} />);
    
    expect(container.querySelector('input[placeholder="Enter book title"]')?.getAttribute('value')).toBe(sampleBook.title);
    expect(container.querySelector('input[placeholder="Enter author name"]')?.getAttribute('value')).toBe(sampleBook.author);
    expect(container.querySelector('input[placeholder="Enter ISBN (numbers only)"]')?.getAttribute('value')).toBe(sampleBook.isbn);
  });

  test('clear button resets form', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    await fillForm(container);
    
    const clearButton = container.querySelector('button[type="button"]')!;
    await fireEvent.click(clearButton);
    
    expect(container.querySelector('input[placeholder="Enter book title"]')?.getAttribute('value')).toBe('');
    expect(container.querySelector('input[placeholder="Enter author name"]')?.getAttribute('value')).toBe('');
  });

  test('handles ISBN input formatting', async () => {
    const { container } = render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    const isbnInput = container.querySelector('input[placeholder="Enter ISBN (numbers only)"]')!;
    await fireEvent.change(isbnInput, { target: { value: '123abc456' } });
    
    expect(isbnInput.getAttribute('value')).toBe('123456');
  });
});