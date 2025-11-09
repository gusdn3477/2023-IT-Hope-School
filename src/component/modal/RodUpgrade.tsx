import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, IconButton, Button } from '@mui/material';
import { fishingStore } from '../../stores/FishingStore';
import { ROD_UPGRADE_COST } from '../../constants/rod';
import { useState } from 'react';

interface RodUpgradeProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 520px;
    max-width: none;
  }
  @media (max-width: 640px) {
    & .MuiDialog-paper {
      width: 95vw;
      margin: 0;
    }
  }
`;

export const RodUpgradeModal = observer(({ open, onClose }: RodUpgradeProps) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const cost = fishingStore.rodLevel ? ROD_UPGRADE_COST[fishingStore.rodLevel as keyof typeof ROD_UPGRADE_COST] : '-';

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fishingStore.upgradeRod();
    if (res) {
      setMessage(res.message);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  }

  return (
    <StyledDialog onClose={handleClose} open={open} disableScrollLock>
      <DialogTitle style={{ textAlign: 'center', fontFamily: 'Neo둥근모' }}>
        낚싯대 강화
        <div style={{ fontSize: 14, marginTop: 6 }}>
          현재 레벨: {fishingStore.rodLevel} / 다음 강화 비용: {cost}원
        </div>
      </DialogTitle>
      <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      {message && <div style={{ textAlign: 'center', padding: '12px', fontFamily: 'Neo둥근모' }}>{message}</div>}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
        <Button variant="contained" onClick={handleUpgrade} style={{ fontFamily: 'Neo둥근모' }} disabled={loading || fishingStore.rodLevel >= 5}>
          {loading ? '강화 중...' : '강화하기'}
        </Button>
      </div>
    </StyledDialog>
  );
});

export default RodUpgradeModal;
