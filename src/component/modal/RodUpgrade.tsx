import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, IconButton, Button } from '@mui/material';
import { fishingStore } from '../../stores/FishingStore';

interface RodUpgradeProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 520px;
    max-width: none;
  }
`;

export const RodUpgradeModal = observer(({ open, onClose }: RodUpgradeProps) => {
  const cost = fishingStore.getUpgradeCost();

  const handleUpgrade = () => {
    const ok = fishingStore.upgradeRod();
    if (ok) onClose();
  };

  return (
    <StyledDialog onClose={onClose} open={open} disableScrollLock>
      <DialogTitle style={{ textAlign: 'center', fontFamily: 'Neo둥근모' }}>
        낚싯대 강화
        <div style={{ fontSize: 14, marginTop: 6 }}>
          현재 레벨: {fishingStore.rodLevel} / 다음 강화 비용: {cost}원
        </div>
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
        <Button variant="contained" onClick={handleUpgrade} style={{ fontFamily: 'Neo둥근모' }}>
          강화하기
        </Button>
      </div>
    </StyledDialog>
  );
});

export default RodUpgradeModal;
 
