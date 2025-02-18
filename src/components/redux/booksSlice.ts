import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../types';

interface BooksState {
  items: Book[];
  searchTerm: string;
  genreFilter: 'all' | 'fiction' | 'non-fiction';
  sortField: 'title' | 'author' | 'isbn' | 'genre' | 'bookType' | 'price';
  sortDirection: 'asc' | 'desc' | 'none';
  selectedBook: Book | null;
}

const initialState: BooksState = {
  items: [],
  searchTerm: '',
  genreFilter: 'all',
  sortField: 'title',
  sortDirection: 'none',
  selectedBook: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks: (state: { items: any; }, action: PayloadAction<Book[]>) => {
      state.items = action.payload;
    },
    addBook: (state: { items: any[]; }, action: PayloadAction<Book>) => {
      state.items.push(action.payload);
    },
    updateBook: (state: { items: any[]; }, action: PayloadAction<Book>) => {
      const index = state.items.findIndex((book: { id: any; }) => book.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteBook: (state: { items: any[]; }, action: PayloadAction<string>) => {
      state.items = state.items.filter((book: { id: any; }) => book.id !== action.payload);
    },
    setSearchTerm: (state: { searchTerm: any; }, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setGenreFilter: (state: { genreFilter: any; }, action: PayloadAction<'all' | 'fiction' | 'non-fiction'>) => {
      state.genreFilter = action.payload;
    },
    setSortField: (state: { sortField: any; }, action: PayloadAction<BooksState['sortField']>) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state: { sortDirection: any; }, action: PayloadAction<BooksState['sortDirection']>) => {
      state.sortDirection = action.payload;
    },
    setSelectedBook: (state: { selectedBook: any; }, action: PayloadAction<Book | null>) => {
      state.selectedBook = action.payload;
    },
    clearFilters: (state: { searchTerm: string; genreFilter: string; sortDirection: string; }) => {
      state.searchTerm = '';
      state.genreFilter = 'all';
      state.sortDirection = 'none';
    },
  },
});

export const {
  setBooks,
  addBook,
  updateBook,
  deleteBook,
  setSearchTerm,
  setGenreFilter,
  setSortField,
  setSortDirection,
  setSelectedBook,
  clearFilters,
} = booksSlice.actions;

export default booksSlice.reducer;