import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import styled from 'styled-components';
import { StyledButton } from './style';
import CloseIcon from '@mui/icons-material/Close';
import unknownFish from '../../assets/fish/unknown_fish.png';

export interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  imageSrc?: string;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 760px;
    min-height: 300px;
    max-width: none;
    overflow-y: hidden;
  }
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  text-align: center;
  font-family: 'Neo둥근모';
`;

const FishImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35));
`;

const Message = styled.p`
  font-size: 22px;
  margin: 0;
  line-height: 1.6;
`;

const ResultModal = (props: ResultModalProps) => {
  const { open, onClose, title, message, imageSrc } = props;

  const handleClose = () => {
    onClose();
  };

  const image = imageSrc || unknownFish;

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
      <DialogContent>
        <Body>
          <FishImage
            src={image}
            alt={title}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.dataset.fallbackApplied === 'true') return;
              target.dataset.fallbackApplied = 'true';
              target.src = unknownFish;
            }}
          />
          <Message>{message}</Message>
        </Body>
      </DialogContent>
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
