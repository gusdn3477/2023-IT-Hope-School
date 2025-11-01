import { Dialog, DialogTitle, IconButton } from '@mui/material';
import styled from 'styled-components';
import { StyledButton } from './style';
import CloseIcon from '@mui/icons-material/Close';

export interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 760px;
    height: 280px;
    max-width: none;
    overflow-y: hidden;
  }
`;

const ResultModal = (props: ResultModalProps) => {
  const { open, onClose, title, message } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <StyledDialog onClose={handleClose} open={open} disableScrollLock>
      <DialogTitle
        style={{
          textAlign: 'center',
          fontSize: '36px',
          fontFamily: 'Neo둥근모',
        }}
      >
        <strong>{title}</strong>
        <br /> {message}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <StyledButton onClick={handleClose}>닫기</StyledButton>
      </div>
    </StyledDialog>
  );
};

export default ResultModal;
