// import React, { useState } from 'react';
// import { 
//   Typography, 
//   TextField, 
//   Button, 
//   Box, 
//   Grid, 
//   Paper, 
//   Select, 
//   MenuItem, 
//   InputLabel, 
//   FormControl,
//   SelectChangeEvent
// } from '@mui/material';
// import { Book, BookFormProps } from '../index';

// export function AddBook({ onAddBook, editingBook }: BookFormProps): JSX.Element {
//   const [formData, setFormData] = useState<Book>(editingBook ? { ...editingBook } : {
//     id: 0,
//     title: '',
//     author: '',
//     isbn: '',
//     publicationDate: '',
//     genre: '',
//     price: '',
//     purchaseLink: '',
//     bookType: ''
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent): void => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
//     e.preventDefault();
//     onAddBook(formData);
//   };

//   return (
//     <Paper elevation={3} sx={{      
//       p: 4, 
//       backgroundColor: 'rgba(255,255,255,0.1)', 
//       color: 'white',
//       '& .MuiInputBase-root': {
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         color: 'white'
//       },
//       '& .MuiInputLabel-root': {
//         color: 'rgba(255,255,255,0.7)'
//       },
//       '& .MuiOutlinedInput-notchedOutline': {
//         borderColor: 'rgba(255,255,255,0.3)'
//       }}}>
//       <Typography variant="h4" gutterBottom>
//         {editingBook ? 'Edit Book' : 'Add New Book'}
//       </Typography>
//       <Box component="form" onSubmit={handleSubmit}>
//         <Grid container spacing={3}>
//           {/* Form fields... */}
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="Book Title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               variant="outlined"
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="Author"
//               name="author"
//               value={formData.author}
//               onChange={handleChange}
//               required
//               variant="outlined"
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="ISBN"
//               name="isbn"
//               value={formData.isbn}
//               onChange={handleChange}
//               required
//               variant="outlined"
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="Publication Date"
//               name="publicationDate"
//               type="date"
//               value={formData.publicationDate}
//               onChange={handleChange}
//               required
//               variant="outlined"
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth variant="outlined" required>
//               <InputLabel>Genre</InputLabel>
//               <Select
//                 name="genre"
//                 value={formData.genre}
//                 onChange={handleChange}
//                 label="Genre"
//               >
//                 <MenuItem value="fiction">Fiction</MenuItem>
//                 <MenuItem value="non-fiction">Non-Fiction</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="Price"
//               name="price"
//               type="number"
//               value={formData.price}
//               onChange={handleChange}
//               required
//               variant="outlined"
//               InputProps={{ inputProps: { step: 0.01 } }}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="Purchase Link"
//               name="purchaseLink"
//               type="url"
//               value={formData.purchaseLink}
//               onChange={handleChange}
//               required
//               variant="outlined"
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth variant="outlined" required>
//               <InputLabel>Book Type</InputLabel>
//               <Select
//                 name="bookType"
//                 value={formData.bookType}
//                 onChange={handleChange}
//                 label="Book Type"
//               >
//                 <MenuItem value="Ebook">E-Book</MenuItem>
//                 <MenuItem value="Printed">Printed Book</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
          
//           <Grid item xs={12}>
//             <Button 
//               type="submit" 
//               variant="contained" 
//               color="primary" 
//               fullWidth
//               size="large"
//             >
//               {editingBook ? 'Update Book' : 'Save Book'}
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//     </Paper>
//   );
// }

import React, { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { 
  StyledPaper,
  FormInput,
  FormSelect,
  SubmitButton,
  Typography,
  Grid,
  Box
} from './ui/AddBookUI';
import { Book, BookFormProps } from '../index';

export function AddBook({ onAddBook, editingBook }: BookFormProps): JSX.Element {
  const [formData, setFormData] = useState<Book>(editingBook ? { ...editingBook } : {
    id: 0,
    title: '',
    author: '',
    isbn: '',
    publicationDate: '',
    genre: '',
    price: '',
    purchaseLink: '',
    bookType: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onAddBook(formData);
  };

  const genreOptions = [
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' }
  ];

  const bookTypeOptions = [
    { value: 'Ebook', label: 'E-Book' },
    { value: 'Printed', label: 'Printed Book' }
  ];

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom>
        {editingBook ? 'Edit Book' : 'Add New Book'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormInput
              label="Book Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormInput
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormInput
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormInput
              label="Publication Date"
              name="publicationDate"
              type="date"
              value={formData.publicationDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormSelect
              name="genre"
              label="Genre"
              value={formData.genre}
              onChange={handleChange}
              options={genreOptions}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormInput
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              InputProps={{ inputProps: { step: 0.01 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormInput
              label="Purchase Link"
              name="purchaseLink"
              type="url"
              value={formData.purchaseLink}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormSelect
              name="bookType"
              label="Book Type"
              value={formData.bookType}
              onChange={handleChange}
              options={bookTypeOptions}
            />
          </Grid>
          
          <Grid item xs={12}>
            <SubmitButton>
              {editingBook ? 'Update Book' : 'Save Book'}
            </SubmitButton>
          </Grid>
        </Grid>
      </Box>
    </StyledPaper>
  );
}