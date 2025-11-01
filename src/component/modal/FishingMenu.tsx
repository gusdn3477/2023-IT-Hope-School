import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { fishingStore } from '../../stores/FishingStore';
import { FISH_LIST } from '../../constants/fish';
import { BAITS } from '../../constants/bait';

interface FishingMenuProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper { width: 860px; max-width: none; }
`;
const StyledCell = styled(TableCell)`
  font-family: 'Neo둥근모';
`;
const StyledTextField = styled(TextField)`
  width: 80px;
  input { font-family: 'Neo둥근모'; }
`;

const SellPanel = observer(() => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const rows = FISH_LIST.filter((f) => (fishingStore.fishBag[f.id] ?? 0) > 0);
  const total = rows.reduce((acc, f) => acc + Math.min(fishingStore.fishBag[f.id] ?? 0, counts[f.id] ?? 0) * f.price, 0);
  const handleSell = () => {
    const items = rows.map((f) => ({ fishId: f.id, price: f.price, count: counts[f.id] ?? 0 }));
    fishingStore.sellFish(items);
    setCounts({});
  };
  return (
    <Box>
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
              <StyledCell align="center" colSpan={4}>판매할 물고기가 없습니다.</StyledCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
        <div style={{ fontFamily: 'Neo둥근모' }}>예상 수익: {total}원</div>
        <Button variant="contained" onClick={handleSell} disabled={total === 0} style={{ fontFamily: 'Neo둥근모' }}>판매하기</Button>
      </div>
    </Box>
  );
});

const RodPanel = observer(() => {
  const cost = fishingStore.getUpgradeCost();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <div style={{ fontFamily: 'Neo둥근모' }}>현재 레벨: {fishingStore.rodLevel}</div>
      <div style={{ fontFamily: 'Neo둥근모' }}>다음 강화 비용: {cost}원</div>
      <Button variant="contained" onClick={() => fishingStore.upgradeRod()} style={{ fontFamily: 'Neo둥근모' }}>강화하기</Button>
    </Box>
  );
});

const BaitPanel = observer(() => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const handleBuy = () => {
    for (const b of BAITS) {
      const c = counts[b.id] ?? 0;
      if (c > 0) fishingStore.buyBait(b.id, c, b.price);
    }
    setCounts({});
  };
  return (
    <Box>
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
          {BAITS.map((b) => (
            <TableRow key={b.id}>
              <StyledCell align="center">{b.name}</StyledCell>
              <StyledCell align="center">+{b.effect}</StyledCell>
              <StyledCell align="center">{b.price}원</StyledCell>
              <StyledCell align="center">{fishingStore.baitInventory[b.id] ?? 0}</StyledCell>
              <StyledCell align="center">
                <StyledTextField
                  type="number"
                  inputProps={{ min: 0 }}
                  value={counts[b.id] ?? 0}
                  onChange={(e) => setCounts({ ...counts, [b.id]: Math.max(0, Number(e.target.value)) })}
                />
              </StyledCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
        <Button variant="contained" onClick={handleBuy} style={{ fontFamily: 'Neo둥근모' }}>구매하기</Button>
      </div>
    </Box>
  );
});

export const FishingMenuModal = observer(({ open, onClose }: FishingMenuProps) => {
  const [tab, setTab] = useState(0);
  return (
    <StyledDialog onClose={onClose} open={open} disableScrollLock>
      <DialogTitle style={{ textAlign: 'center', fontFamily: 'Neo둥근모' }}>
        낚시 메뉴
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
        <Tab label="판매" />
        <Tab label="강화" />
        <Tab label="미끼" />
      </Tabs>
      <Box p={2}>
        {tab === 0 && <SellPanel />}
        {tab === 1 && <RodPanel />}
        {tab === 2 && <BaitPanel />}
      </Box>
    </StyledDialog>
  );
});

export default FishingMenuModal;
