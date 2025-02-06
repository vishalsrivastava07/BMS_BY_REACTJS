import React, { useState, useEffect } from 'react';
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

type SortField = 'title' | 'author' | 'isbn' | 'genre' | 'bookType' | 'price';
type SortDirection = 'asc' | 'desc' | 'none';

export const BookList: React.FC<BookListProps> = ({ 
  books: initialBooks, 
  onDelete, 
  onEdit, 
  onShowAddBook 
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [genreFilter, setGenreFilter] = useState<'all' | 'fiction' | 'non-fiction'>('all');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');

  // Load books from localStorage on component mount
  useEffect(() => {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      // Use stored books if available
      setBooks(JSON.parse(storedBooks));
    } else {
      // Only use initialBooks if no stored books exist
      setBooks(initialBooks);
      localStorage.setItem('books', JSON.stringify(initialBooks));
    }
  }, []); // Remove initialBooks from dependency array

  // Update books state when initialBooks prop changes
  useEffect(() => {
    if (initialBooks.length > 0) {
      const storedBooks = localStorage.getItem('books');
      const currentBooks = storedBooks ? JSON.parse(storedBooks) : [];
      
      // Merge new books with existing books, avoiding duplicates
      const mergedBooks = [...currentBooks];
      initialBooks.forEach(newBook => {
        if (!currentBooks.some((book: { id: string; }) => book.id === newBook.id)) {
          mergedBooks.push(newBook);
        }
      });
      
      setBooks(mergedBooks);
      localStorage.setItem('books', JSON.stringify(mergedBooks));
    }
  }, [initialBooks]);

  // Update localStorage when books change through operations (add/edit/delete)
  const handleBookChange = (updatedBooks: Book[]) => {
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  // Modified delete handler
  const handleDelete = (id: string) => {
    const updatedBooks = books.filter(book => book.id !== id);
    handleBookChange(updatedBooks);
    onDelete(id);
  };

  // Modified edit handler
  const handleEdit = (editedBook: Book) => {
    const updatedBooks = books.map(book => 
      book.id === editedBook.id ? editedBook : book
    );
    handleBookChange(updatedBooks);
    onEdit(editedBook);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setGenreFilter('all');
    setSortDirection('none');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => {
        if (prev === 'none') return 'asc';
        if (prev === 'asc') return 'desc';
        return 'none';
      });
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕';
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
      if (sortDirection === 'none') return 0;
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      const compareResult = typeof aValue === 'string' 
        ? aValue.localeCompare(bValue as string)
        : (aValue as number) - (bValue as number);
        
      return sortDirection === 'asc' ? compareResult : -compareResult;
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
              onShowAddBook={onShowAddBook}
              onClearFilters={clearAllFilters} sortOrder={'asc'} onSortChange={function (_order: 'none' | 'asc' | 'desc'): void {
                throw new Error('Function not implemented.');
              } }            />
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
                    <th 
                      className="p-4 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('title')}
                    >
                      Title {getSortIcon('title')}
                    </th>
                    <th 
                      className="p-4 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('author')}
                    >
                      Author {getSortIcon('author')}
                    </th>
                    <th 
                      className="p-4 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('isbn')}
                    >
                      ISBN {getSortIcon('isbn')}
                    </th>
                    <th 
                      className="p-4 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('genre')}
                    >
                      Genre {getSortIcon('genre')}
                    </th>
                    <th 
                      className="p-4 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('bookType')}
                    >
                      Book Type {getSortIcon('bookType')}
                    </th>
                    <th 
                      className="p-4 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('price')}
                    >
                      Price {getSortIcon('price')}
                    </th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => (
                    <BookTableRow
                      key={book.id}
                      book={book}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
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