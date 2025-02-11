import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookTableRow } from './BookTableRow';
import { Book } from './types';

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'John Doe',
  isbn: '1234567890',
  publicationDate: '2023-01-01',
  genre: 'fiction',
  price: 19.99,
  purchaseLink: 'https://example.com',
  bookType: 'Ebook',
};

describe('BookTableRow', () => {
  it('renders book details correctly', () => {
    render(
      <table>
        <tbody>
          <BookTableRow book={mockBook} onEdit={() => {}} onDelete={() => {}} onShowDetails={() => {}} />
        </tbody>
      </table>
    );

    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
    expect(screen.getByText(mockBook.isbn)).toBeInTheDocument();
    expect(screen.getByText(mockBook.genre)).toBeInTheDocument();
    expect(screen.getByText(mockBook.bookType)).toBeInTheDocument();
    expect(screen.getByText(`$${mockBook.price}`)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEditMock = vi.fn();
    render(
      <table>
        <tbody>
          <BookTableRow book={mockBook} onEdit={onEditMock} onDelete={() => {}} onShowDetails={() => {}} />
        </tbody>
      </table>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    expect(onEditMock).toHaveBeenCalledWith(mockBook);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDeleteMock = vi.fn();
    render(
      <table>
        <tbody>
          <BookTableRow book={mockBook} onEdit={() => {}} onDelete={onDeleteMock} onShowDetails={() => {}} />
        </tbody>
      </table>
    );
    
    fireEvent.click(screen.getByText('Delete'));
    expect(onDeleteMock).toHaveBeenCalledWith(mockBook.id);
  });

  it('calls onShowDetails when details button is clicked', () => {
    const onShowDetailsMock = vi.fn();
    render(
      <table>
        <tbody>
          <BookTableRow book={mockBook} onEdit={() => {}} onDelete={() => {}} onShowDetails={onShowDetailsMock} />
        </tbody>
      </table>
    );
    
    fireEvent.click(screen.getByText('Details'));
    expect(onShowDetailsMock).toHaveBeenCalledWith(mockBook);
  });
});