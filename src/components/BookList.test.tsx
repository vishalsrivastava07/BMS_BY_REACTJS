import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookList from './BookList';
import { Book } from './types';

const mockBooks: Book[] = [
  {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      genre: 'fiction',
      price: 10.99,
      publicationDate: '1925-04-10',
      purchaseLink: 'https://example.com/gatsby',
      bookType: 'Ebook'
  },
  {
    id: '2',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    genre: 'non-fiction',
    bookType: 'Ebook',
    price: 14.99,
    publicationDate: '2011-09-04',
    purchaseLink: 'https://example.com/sapiens',
  },
];

describe('BookList Component', () => {
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnShowAddBook = vi.fn();

  it('renders the book list with initial data', () => {
    render(
      <BookList books={mockBooks} onDelete={mockOnDelete} onEdit={mockOnEdit} onShowAddBook={mockOnShowAddBook} />
    );
    
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
    expect(screen.getByText('Sapiens')).toBeInTheDocument();
  });

  it('filters books based on search input', () => {
    render(
      <BookList books={mockBooks} onDelete={mockOnDelete} onEdit={mockOnEdit} onShowAddBook={mockOnShowAddBook} />
    );
    const searchInput = screen.getByPlaceholderText('Search books...');
    fireEvent.change(searchInput, { target: { value: 'Sapiens' } });
    
    expect(screen.queryByText('The Great Gatsby')).not.toBeInTheDocument();
    expect(screen.getByText('Sapiens')).toBeInTheDocument();
  });

  it('deletes a book when delete button is clicked', () => {
    render(
      <BookList books={mockBooks} onDelete={mockOnDelete} onEdit={mockOnEdit} onShowAddBook={mockOnShowAddBook} />
    );
    
    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('opens book details modal when clicking details button', () => {
    render(
      <BookList books={mockBooks} onDelete={mockOnDelete} onEdit={mockOnEdit} onShowAddBook={mockOnShowAddBook} />
    );
    
    const detailsButton = screen.getAllByText('Details')[0];
    fireEvent.click(detailsButton);
    
    expect(screen.getByText('Book Details')).toBeInTheDocument();
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
  });

  it('sorts books by title when clicking the sort button', () => {
    render(
      <BookList books={mockBooks} onDelete={mockOnDelete} onEdit={mockOnEdit} onShowAddBook={mockOnShowAddBook} />
    );
    
    const sortButton = screen.getByText('Title ↕');
    fireEvent.click(sortButton);
    
    expect(screen.getByText('Title ↑')).toBeInTheDocument();
  });
});
