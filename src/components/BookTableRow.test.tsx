import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookTableRow } from './BookTableRow';
import { Book } from './types';

const mockBook: Book = {
  id: '1',
  title: 'Test',
  author: 'vish',
  isbn: '1',
  publicationDate: '2023-01-01',
  genre: 'fiction',
  price: 1,
  purchaseLink: 'https://example.com',
  bookType: 'Ebook',
  description: ''
};

describe('BookTableRow', () => {

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