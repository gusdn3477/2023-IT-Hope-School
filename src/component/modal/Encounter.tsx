import { Dialog } from '@mui/material';
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

export interface EncounterModalProps {
  open: boolean;
  fishName: string;
  imageSrc?: string;
  onClose: () => void;
  autoCloseMs?: number; // default 1200ms
}

const slideIn = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 640px;
    max-width: none;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    border-radius: 12px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
`;

const Text = styled.div`
  font-family: 'Neo둥근모';
  font-size: 24px;
  line-height: 1.4;
  animation: ${slideIn} 300ms ease-out;
`;

const Image = styled.img`
  width: 160px;
  height: 160px;
  object-fit: contain;
  animation: ${fadeIn} 400ms ease-in;
  filter: drop-shadow(0 8px 12px rgba(0,0,0,0.6));
`;

export const EncounterModal = (props: EncounterModalProps) => {
  const { open, fishName, imageSrc, onClose, autoCloseMs = 1200 } = props;

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => onClose(), autoCloseMs);
      return () => clearTimeout(t);
    }
  }, [open, autoCloseMs, onClose]);

  const fallback = '/fish/placeholder.png'; // user can add images in public/fish/

  return (
    <StyledDialog open={open} onClose={onClose} disableScrollLock>
      <Wrapper>
        <Image src={imageSrc || fallback} alt={fishName} onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src !== window.location.origin + fallback) {
            target.src = fallback;
          }
        }} />
        <Text>
          야생의 <strong style={{ color: '#4FC3F7' }}>{fishName}</strong>가 나타났다!
        </Text>
      </Wrapper>
    </StyledDialog>
  );
};

export default EncounterModal;
