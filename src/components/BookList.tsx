import React, { useState } from 'react';
import { Book } from './types';
import { BookListHeader } from './BookListHeader';
import { BookSearchBar } from './BookSearchBar';
import { BookListControls } from './BookListControls';
import { BookTableRow } from './BookTableRow';
import { BookDetailsModal } from './BookDetailsModal';

export interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
  onShowAddBook: () => void;
}

export const BookList: React.FC<BookListProps> = ({ 
  books, 
  onDelete, 
  onEdit, 
  onShowAddBook 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [genreFilter, setGenreFilter] = useState<'all' | 'fiction' | 'non-fiction'>('all');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const clearAllFilters = () => {
    setSearchTerm('');
    setGenreFilter('all');
    setSortOrder('none');
  };

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;
      
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === 'desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-auto bg-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center mb-4 gap-4">
          <div className="w-full md:w-5/12">
            <BookSearchBar
              searchTerm={searchTerm}
              genreFilter={genreFilter}
              onSearchChange={setSearchTerm}
              onGenreChange={setGenreFilter}
            />
          </div>
          <div className="w-full md:w-7/12">
            <BookListControls
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              onShowAddBook={onShowAddBook}
              onClearFilters={clearAllFilters}
            />
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-center text-xl">No books found matching your search criteria</p>
          </div>
        ) : (
          <>
            <BookListHeader
              totalBooks={books.length}
              filteredCount={filteredBooks.length}
            />
            <div className="overflow-x-auto">
              <table className="w-full bg-white border rounded">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">Author</th>
                    <th className="p-4 text-left">ISBN</th>
                    <th className="p-4 text-left">Genre</th>
                    <th className="p-4 text-left">Book Type</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => (
                    <BookTableRow
                      key={book.id}
                      book={book}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onShowDetails={setSelectedBook}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default BookList;