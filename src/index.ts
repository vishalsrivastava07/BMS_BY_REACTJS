export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publicationDate: string;
    genre: string;
    price: string;
    purchaseLink: string;
    bookType: string;
  }
  
  export interface BookFormProps {
    onAddBook: (book: Book) => void;
    editingBook: Book | null;
  }
  
  export interface BookListProps {
    books: Book[];
    onDeleteBook: (id: number) => void;
    onEditBook: (book: Book) => void;
  }