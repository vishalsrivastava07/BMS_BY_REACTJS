export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publicationDate: string;
    genre: 'fiction' | 'non-fiction';
    price: number;
    purchaseLink: string;
    bookType: 'Ebook' | 'printedBook';
  }