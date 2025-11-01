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
import { FISH_LIST } from '../../constants/fish';
import { fishingStore } from '../../stores/FishingStore';
import { useState } from 'react';

interface SellFishProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper { width: 760px; max-width: none; }
`;

const StyledCell = styled(TableCell)`
  font-family: 'Neo둥근모';
`;

const StyledTextField = styled(TextField)`
  width: 80px;
  input { font-family: 'Neo둥근모'; }
`;

export const SellFishModal = observer(({ open, onClose }: SellFishProps) => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  const rows = FISH_LIST.filter((f) => (fishingStore.fishBag[f.id] ?? 0) > 0);

  const total = rows.reduce((acc, f) => {
    const c = Math.min(fishingStore.fishBag[f.id] ?? 0, counts[f.id] ?? 0);
    return acc + c * f.price;
  }, 0);

  const handleSell = () => {
    const items = rows.map((f) => ({ fishId: f.id, price: f.price, count: counts[f.id] ?? 0 }));
    fishingStore.sellFish(items);
    setCounts({});
    onClose();
  };

  return (
    <StyledDialog onClose={onClose} open={open} disableScrollLock>
      <DialogTitle style={{ textAlign: 'center', fontFamily: 'Neo둥근모' }}>
        물고기 판매
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <Table>
        <TableHead>
          <TableRow>
            <StyledCell align="center">이름</StyledCell>
            <StyledCell align="center">가격</StyledCell>
            <StyledCell align="center">보유</StyledCell>
            <StyledCell align="center">판매 수량</StyledCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((f) => (
            <TableRow key={f.id}>
              <StyledCell align="center">{f.name}</StyledCell>
              <StyledCell align="center">{f.price}원</StyledCell>
              <StyledCell align="center">{fishingStore.fishBag[f.id]}</StyledCell>
              <StyledCell align="center">
                <StyledTextField
                  type="number"
                  inputProps={{ min: 0, max: fishingStore.fishBag[f.id] }}
                  value={counts[f.id] ?? 0}
                  onChange={(e) => setCounts({ ...counts, [f.id]: Math.max(0, Math.min(Number(e.target.value), fishingStore.fishBag[f.id])) })}
                />
              </StyledCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <StyledCell align="center" colSpan={4}>
                판매할 물고기가 없습니다.
              </StyledCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
        <div style={{ fontFamily: 'Neo둥근모' }}>예상 수익: {total}원</div>
        <Button variant="contained" onClick={handleSell} disabled={total === 0} style={{ fontFamily: 'Neo둥근모' }}>
          판매하기
        </Button>
      </div>
    </StyledDialog>
  );
});

export default SellFishModal;
