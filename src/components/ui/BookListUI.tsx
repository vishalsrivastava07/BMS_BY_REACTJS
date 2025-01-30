import { ReactNode } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  PaperProps,
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  DialogProps
} from '@mui/material';
import { Edit, Delete, Visibility, Close } from '@mui/icons-material';

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
      '& .MuiTableCell-root': {
        borderColor: 'rgba(255,255,255,0.2)',
        color: 'white'
      }
    }}
    {...props}
  >
    {children}
  </Paper>
);

export const StyledTable = ({ children, ...props }: TableProps & BaseProps) => (
  <TableContainer>
    <Table {...props}>{children}</Table>
  </TableContainer>
);

export const StyledTableHead = ({ children, ...props }: TableHeadProps & BaseProps) => (
  <TableHead {...props}>{children}</TableHead>
);

export const StyledTableBody = ({ children, ...props }: TableBodyProps & BaseProps) => (
  <TableBody {...props}>{children}</TableBody>
);

export const StyledTableRow = ({ children, ...props }: TableRowProps & BaseProps) => (
  <TableRow {...props}>{children}</TableRow>
);

export const StyledTableCell = ({ children, ...props }: TableCellProps & BaseProps) => (
  <TableCell {...props}>{children}</TableCell>
);

interface StyledDialogProps extends Omit<DialogProps, 'open'> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const StyledDialog = ({ open, onClose, children, ...props }: StyledDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    {...props}
  >
    {children}
  </Dialog>
);

interface StyledDialogTitleProps {
  onClose?: () => void;
  children: ReactNode;
}

export const StyledDialogTitle = ({ onClose, children }: StyledDialogTitleProps) => (
  <DialogTitle>
    {children}
    {onClose && (
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <Close />
      </IconButton>
    )}
  </DialogTitle>
);

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export const ActionButtons = ({ onEdit, onDelete, onView }: ActionButtonsProps) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <IconButton color="primary" onClick={onEdit}>
      <Edit />
    </IconButton>
    <IconButton color="error" onClick={onDelete}>
      <Delete />
    </IconButton>
    <IconButton color="info" onClick={onView}>
      <Visibility />
    </IconButton>
  </Box>
);

export { Typography, Grid, DialogContent };