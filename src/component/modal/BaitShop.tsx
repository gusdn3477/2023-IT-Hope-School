import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
} from '@mui/material';
import { BAITS } from '../../constants/bait';
import { fishingStore } from '../../stores/FishingStore';
import { useState } from 'react';

interface BaitShopProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 700px;
    max-width: none;
  }
`;

const StyledCell = styled(TableCell)`
  font-family: 'Neo둥근모';
`;

const StyledTextField = styled(TextField)`
  width: 80px;
  input { font-family: 'Neo둥근모'; }
`;

export const BaitShopModal = observer(({ open, onClose }: BaitShopProps) => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  const handleBuy = async () => {
    for (const baitId in counts) {
      const count = counts[baitId];
      if (count > 0) {
        await fishingStore.buyBait(baitId, count);
      }
    }
    setCounts({});
    onClose();
  };

  return (
    <StyledDialog onClose={onClose} open={open} disableScrollLock>
      <DialogTitle style={{ textAlign: 'center', fontFamily: 'Neo둥근모' }}>
        미끼 상점
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <Table>
        <TableHead>
          <TableRow>
            <StyledCell align="center">이름</StyledCell>
            <StyledCell align="center">효과</StyledCell>
            <StyledCell align="center">가격</StyledCell>
            <StyledCell align="center">보유</StyledCell>
            <StyledCell align="center">구매 수량</StyledCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(BAITS).map(([id, b]) => (
            <TableRow key={id}>
              <StyledCell align="center">{b.name}</StyledCell>
              <StyledCell align="center">+{b.catch_rate_bonus}</StyledCell>
              <StyledCell align="center">{b.price}원</StyledCell>
              <StyledCell align="center">{fishingStore.baitInventory[id] ?? 0}</StyledCell>
              <StyledCell align="center">
                <StyledTextField
                  type="number"
                  inputProps={{ min: 0 }}
                  value={counts[id] ?? 0}
                  onChange={(e) => setCounts({ ...counts, [id]: Math.max(0, Number(e.target.value)) })}
                />
              </StyledCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
        <Button variant="contained" onClick={handleBuy} style={{ fontFamily: 'Neo둥근모' }}>구매하기</Button>
      </div>
    </StyledDialog>
  );
});

export default BaitShopModal;
