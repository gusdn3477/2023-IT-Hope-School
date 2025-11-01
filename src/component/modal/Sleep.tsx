import { Dialog, DialogTitle } from '@mui/material';
import { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import goodnight from '../../assets/goodnight.png';

export interface SleepModalProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: min(720px, 90vw);
    max-width: 90vw;
    overflow-y: hidden;
  }
`;

const SleepModal = (props: SleepModalProps) => {
  const { open, onClose } = props;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      handleClose();
    }, 2000);
    return () => clearTimeout(t);
  }, [open, handleClose]);

  return (
    <StyledDialog onClose={handleClose} open={open} disableScrollLock>
      <DialogTitle
        style={{
          textAlign: 'center',
          fontSize: '32px',
          fontFamily: 'Neo둥근모',
        }}
      >
        Good Night
      </DialogTitle>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={goodnight} style={{ width: '100%', maxWidth: '720px', height: 'auto' }} />
      </div>
    </StyledDialog>
  );
};

export default SleepModal;
