import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import styled from 'styled-components';

export const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 800px;
  }
`;
export const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 26px;
`;

export const StyledDialogHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const StyledDialogContentText = styled(DialogContentText)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const StyledDialogActions = styled(DialogActions)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledTextField = styled(TextField)`
  &
    MuiInputBase-root
    MuiInput-root
    MuiInput-underline
    MuiInputBase-colorPrimary
    MuiInputBase-fullWidth
    MuiInputBase-formControl {
    background-color: black;
  }

  & label.Mui-error {
    color: '#d32f2f';
  }

  height: 66px;
`;

export const StyledButton = styled(Button)`
  background-color: black;
  color: white;
  width: 180px;
  height: 48px;
  &:hover {
    background-color: black;
  }
  border-radius: 8px;
`;

export const StyledListItemText = styled(ListItemText)`
  display: flex;
  width: 180px;
  align-items: center;
  justify-content: center;
`;

export const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
