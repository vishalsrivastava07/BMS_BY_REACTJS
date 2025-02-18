export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: Genre;
  bookType: BookType;
  price: number;
  description: string;
  purchaseLink: string;
  publicationDate: string;
}


export type Genre = 'fiction' | 'non-fiction';
export type BookType =  'Printedbook' | 'Ebook';
export type SortDirection = 'none' | 'asc' | 'desc';
export type SortField = 'title' | 'author' | 'isbn' | 'genre' | 'bookType' | 'price';
export type GenreFilter = Genre | 'all';