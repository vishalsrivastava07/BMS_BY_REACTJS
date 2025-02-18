import React, { useEffect } from 'react';
import { Book } from './types';
import { BookListHeader } from './BookListHeader';
import { BookSearchBar } from './BookSearchBar';
import { BookListControls } from './BookListControls';
import { BookTableRow } from './BookTableRow';
import { BookDetailsModal } from './BookDetailsModal';
import { useAppDispatch, useAppSelector } from '../components/redux/hooks';
import {
  setBooks,
  deleteBook,
  updateBook,
  setSortField,
  setSortDirection,
  setSelectedBook,
} from '../components/redux/booksSlice';

export interface BookListProps {
  books: Book[];
  onShowAddBook: () => void;
}

type SortField = 'title' | 'author' | 'isbn' | 'genre' | 'bookType' | 'price';

export const BookList: React.FC<BookListProps> = ({ 
  books: initialBooks, 
  onShowAddBook 
}) => {
  const dispatch = useAppDispatch();
  const {
    items: books,
    searchTerm,
    genreFilter,
    sortField,
    sortDirection,
    selectedBook,
  } = useAppSelector((state: { books: any; }) => state.books);

  useEffect(() => {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      dispatch(setBooks(JSON.parse(storedBooks)));
    } else {
      dispatch(setBooks(initialBooks));
      localStorage.setItem('books', JSON.stringify(initialBooks));
    }
  }, []);

  useEffect(() => {
    if (initialBooks.length > 0) {
      const storedBooks = localStorage.getItem('books');
      const currentBooks = storedBooks ? JSON.parse(storedBooks) : [];
      
      const mergedBooks = [...currentBooks];
      initialBooks.forEach(newBook => {
        if (!currentBooks.some((book: { id: string; }) => book.id === newBook.id)) {
          mergedBooks.push(newBook);
        }
      });
      
      dispatch(setBooks(mergedBooks));
      localStorage.setItem('books', JSON.stringify(mergedBooks));
    }
  }, [initialBooks]);

  const handleDelete = (id: string) => {
    dispatch(deleteBook(id));
    const updatedBooks = books.filter((book: { id: string; }) => book.id !== id);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const handleEdit = (editedBook: Book) => {
    dispatch(updateBook(editedBook));
    const updatedBooks = books.map((book: { id: string; }) => 
      book.id === editedBook.id ? editedBook : book
    );
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      dispatch(setSortDirection(
        sortDirection === 'none' ? 'asc' :
        sortDirection === 'asc' ? 'desc' : 'none'
      ));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection('asc'));
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕';
  };

  const filteredBooks = books
    .filter((book: { title: string; author: string; isbn: string; genre: any; }) => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;
      
      return matchesSearch && matchesGenre;
    })
    .sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
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
            <BookSearchBar />
          </div>
          <div className="w-full md:w-7/12">
            <BookListControls onShowAddBook={onShowAddBook} />
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
                  {filteredBooks.map((book: Book) => (
                    <BookTableRow
                      key={book.id}
                      book={book}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onShowDetails={() => dispatch(setSelectedBook(book))}
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
          onClose={() => dispatch(setSelectedBook(null))}
        />
      )}
    </div>
  );
};
