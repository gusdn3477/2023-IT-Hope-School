import { Dialog, DialogTitle, IconButton } from '@mui/material';
import styled from 'styled-components';
import { StyledButton } from './style';
import CloseIcon from '@mui/icons-material/Close';

export interface HarvestModalProps {
  open: boolean;
  onClose: () => void;
  money: number;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 600px;
    height: 200px;
    max-width: none;
    overflow-y: hidden;
  }
`;

const HarvestModal = (props: HarvestModalProps) => {
  const { open, onClose, money } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <StyledDialog onClose={handleClose} open={open} disableScrollLock>
      <DialogTitle
        style={{
          textAlign: 'center',
          fontSize: '32px',
          fontFamily: 'Neo둥근모',
        }}
      >
        <strong>축하합니다.</strong>
        <br /> {money}원을 얻었습니다!
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

export default HarvestModal;
