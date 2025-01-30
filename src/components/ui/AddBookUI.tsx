import { ReactNode } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Paper, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl,
  TextFieldProps,
  SelectChangeEvent,
  ButtonProps,
  PaperProps
} from '@mui/material';

interface BaseProps {
  children: ReactNode;
}

export const StyledPaper = ({ children, ...props }: PaperProps & BaseProps) => (
  <Paper 
    elevation={3} 
    sx={{      
      p: 4, 
      backgroundColor: 'rgba(255,255,255,0.1)', 
      color: 'white',
      '& .MuiInputBase-root': {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white'
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255,255,255,0.7)'
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.3)'
      }
    }}
    {...props}
  >
    {children}
  </Paper>
);

interface FormInputProps extends Omit<TextFieldProps, 'onChange'> {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
}

export const FormInput = ({ ...props }: FormInputProps) => (
  <TextField
    fullWidth
    variant="outlined"
    required
    {...props}
  />
);

interface SelectInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent) => void;
  options: Array<{value: string; label: string}>;
}

export const FormSelect = ({ name, label, value, onChange, options }: SelectInputProps) => (
  <FormControl fullWidth variant="outlined" required>
    <InputLabel>{label}</InputLabel>
    <Select
      name={name}
      value={value}
      onChange={onChange}
      label={label}
    >
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export const SubmitButton = ({ children, ...props }: ButtonProps & BaseProps) => (
  <Button 
    type="submit" 
    variant="contained" 
    color="primary" 
    fullWidth
    size="large"
    {...props}
  >
    {children}
  </Button>
);

export { Typography, Grid, Box };