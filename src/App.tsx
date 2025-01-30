import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  AppBar, 
  Toolbar, 
  Snackbar,
  Alert
} from '@mui/material';
import { AddBook } from './components/AddBook';
import {BookList} from './components/BookList'
import { Book } from './index';

function App(): JSX.Element {
  const [books, setBooks] = useState<Book[]>([]);
  const [showBookList, setShowBookList] = useState<boolean>(false);
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleAddBook = (newBook: Book): void => {
    let updatedBooks: Book[];
    if (editingBook) {
      updatedBooks = books.map(book => 
        book.id === editingBook.id ? newBook : book
      );
      setToastMessage('Book updated successfully!');
    } else {
      updatedBooks = [...books, { ...newBook, id: Date.now() }];
      setToastMessage('Book added successfully!');
    }
    
    setBooks(updatedBooks);
    setOpenToast(true);
    setEditingBook(null);
    setShowBookList(true);
  };

  const handleDeleteBook = (bookId: number): void => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    setBooks(updatedBooks);
    setToastMessage('Book deleted successfully!');
    setOpenToast(true);
  };

  const handleEditBook = (book: Book): void => {
    setEditingBook(book);
    setShowBookList(false);
  };

  const handleCloseToast = (_event: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') return;
    setOpenToast(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'black', color: 'white' }}>
      <AppBar position="static" color="transparent" sx={{ backgroundColor: 'rgba(10, 8, 8, 0.7)'}}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit">Book Management System</Typography>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => {
              setShowBookList(!showBookList);
              setEditingBook(null);
            }}
          >
            {showBookList ? 'Add Book' : 'Book List'}
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {!showBookList ? (
          <AddBook 
            onAddBook={handleAddBook} 
            editingBook={editingBook}
          />
        ) : (
          <BookList 
            books={books} 
            onDeleteBook={handleDeleteBook}
            onEditBook={handleEditBook}
          />
        )}
      </Container>

      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity="success" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;