import { useState } from 'react';
import {
  StyledPaper,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
  StyledDialog,
  StyledDialogTitle,
  ActionButtons,
  Typography,
  Grid,
  DialogContent
} from './ui/BookListUI';
import { Book, BookListProps } from '../index';

export function BookList({ books, onDeleteBook, onEditBook }: BookListProps): JSX.Element {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);

  const handleOpenDetails = (book: Book): void => {
    setSelectedBook(book);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetails = (): void => {
    setOpenDetailsDialog(false);
    setSelectedBook(null);
  };

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom>
        Book List
      </Typography>
      
      {books.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No books added yet
        </Typography>
      ) : (
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Author</StyledTableCell>
              <StyledTableCell>Genre</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Book Type</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            {books.map(book => (
              <StyledTableRow key={book.id}>
                <StyledTableCell>{book.title}</StyledTableCell>
                <StyledTableCell>{book.author}</StyledTableCell>
                <StyledTableCell>{book.genre}</StyledTableCell>
                <StyledTableCell>{book.price}</StyledTableCell>
                <StyledTableCell>{book.bookType}</StyledTableCell>
                <StyledTableCell>
                  <ActionButtons
                    onEdit={() => onEditBook(book)}
                    onDelete={() => onDeleteBook(book.id)}
                    onView={() => handleOpenDetails(book)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </StyledTableBody>
        </StyledTable>
      )}

      <StyledDialog
        open={openDetailsDialog}
        onClose={handleCloseDetails}
      >
        <StyledDialogTitle onClose={handleCloseDetails}>
          Book Details
        </StyledDialogTitle>
        <DialogContent>
          {selectedBook && (
            <Grid container spacing={2}>
              {Object.entries(selectedBook).map(([key, value]) => 
                key !== 'id' ? (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography variant="body1">
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                    </Typography>
                  </Grid>
                ) : null
              )}
            </Grid>
          )}
        </DialogContent>
      </StyledDialog>
    </StyledPaper>
  );
}