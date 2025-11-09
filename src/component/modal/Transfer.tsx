import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useState } from 'react';
import { useStore } from '../../hooks/useStore';

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper { width: 760px; max-width: none; }
  @media (max-width: 640px) {
    & .MuiDialog-paper {
      width: 100vw;
      max-width: 100vw;
      margin: 0;
      height: 100vh;
      border-radius: 0;
    }
  }
`;
const StyledCell = styled(TableCell)`
  font-family: 'Neo둥근모';
`;

export const TransferModal = observer(({ open, onClose }: TransferModalProps) => {
  const { userStore, fishingStore } = useStore();
  const [tab, setTab] = useState<'money'|'fish'>('money');
  const [toPlayerId, setToPlayerId] = useState('');
  const [amount, setAmount] = useState('');
  const [fishQuantity, setFishQuantity] = useState('');
  const [selectedFishId, setSelectedFishId] = useState<number|null>(null);

  const handleSubmitMoney = async () => {
    if (!toPlayerId || !amount) return;
    const a = parseInt(amount, 10);
    if (isNaN(a) || a <= 0) return;
    const ok = await userStore.transferMoney(toPlayerId, a);
    if (ok) {
      await fishingStore.loadInventory();
    }
    setAmount('');
    setToPlayerId('');
    userStore.clearUserSearch();
  };

  const handleSubmitFish = async () => {
    if (!toPlayerId || !fishQuantity || selectedFishId == null) return;
    const q = parseInt(fishQuantity, 10);
    if (isNaN(q) || q <= 0) return;
    const ok = await userStore.transferFish(toPlayerId, selectedFishId, q);
    if (ok) {
      await fishingStore.loadInventory();
    }
    setFishQuantity('');
    setToPlayerId('');
    setSelectedFishId(null);
    userStore.clearUserSearch();
  };

  // Build fish list from inventory (fishingStore.fishBag + encyclopedia names)
  const fishRows = fishingStore.caughtFish
    .filter(f => (fishingStore.fishBag[f.id] ?? 0) > 0)
    .map(f => ({
      id: f.id,
      name: f.name,
      count: fishingStore.fishBag[f.id] ?? 0,
      level: f.level,
    }));

  return (
    <StyledDialog onClose={onClose} open={open} disableScrollLock>
      <DialogTitle style={{ textAlign: 'center', fontFamily: 'Neo둥근모' }}>
        친구에게 송금 / 물고기 전달
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
        <Tab label="돈" value="money" />
        <Tab label="물고기" value="fish" />
      </Tabs>
      {tab === 'money' && (
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextField
            label="받는 사용자 ID"
            value={toPlayerId}
            onChange={e => {
              const v = e.target.value;
              setToPlayerId(v);
              if (v.trim() === '') userStore.clearUserSearch(); else userStore.searchUsers(v);
            }}
            onBlur={() => {
              setTimeout(() => { if (!toPlayerId) userStore.clearUserSearch(); }, 180);
            }}
          />
          {/* Suggestions */}
          {userStore.userSearchResults.length > 0 && (
            <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #eee', borderRadius: 6 }}>
              <Table size="small">
                <TableBody>
                  {userStore.userSearchResults.slice(0, 10).map(u => (
                    <TableRow
                      key={u.playerId}
                      onClick={() => { setToPlayerId(u.playerId); userStore.clearUserSearch(); }}
                      style={{ cursor: 'pointer' }}
                    >
                      <StyledCell>{u.nickname}</StyledCell>
                      <StyledCell>{u.playerId}</StyledCell>
                      {/* level removed */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <TextField label="금액" value={amount} onChange={e => setAmount(e.target.value)} type="number" />
          <div style={{ fontFamily: 'Neo둥근모' }}>내 보유금: {userStore.user?.money ?? 0}원</div>
          <Button variant="contained" disabled={userStore.transferLoading} onClick={handleSubmitMoney}>
            {userStore.transferLoading ? '송금 중...' : '송금하기'}
          </Button>
        </div>
      )}
      {tab === 'fish' && (
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <TextField label="받는 사용자 ID" value={toPlayerId} onChange={e => { setToPlayerId(e.target.value); userStore.searchUsers(e.target.value); }} />
            <TextField label="수량" value={fishQuantity} onChange={e => setFishQuantity(e.target.value)} type="number" />
          </div>
          {userStore.userSearchResults.length > 0 && (
            <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #eee', borderRadius: 6, marginBottom: 12 }}>
              <Table size="small">
                <TableBody>
                  {userStore.userSearchResults.slice(0, 10).map(u => (
                    <TableRow key={u.playerId} onClick={() => { setToPlayerId(u.playerId); userStore.clearUserSearch(); }} style={{ cursor: 'pointer' }}>
                      <StyledCell>{u.nickname}</StyledCell>
                      <StyledCell>{u.playerId}</StyledCell>
                      {/* level removed */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledCell align="center">선택</StyledCell>
                <StyledCell align="center">이름</StyledCell>
                <StyledCell align="center">희귀도</StyledCell>
                <StyledCell align="center">보유수</StyledCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fishRows.map(r => (
                <TableRow key={r.id} selected={selectedFishId === parseInt(r.id)} onClick={() => setSelectedFishId(parseInt(r.id))} style={{ cursor: 'pointer' }}>
                  <StyledCell align="center">{selectedFishId === parseInt(r.id) ? '●' : '○'}</StyledCell>
                  <StyledCell align="center">{r.name}</StyledCell>
                  <StyledCell align="center">{r.level}</StyledCell>
                  <StyledCell align="center">{r.count}</StyledCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button style={{ marginTop: 16 }} variant="contained" disabled={userStore.transferLoading || selectedFishId == null} onClick={handleSubmitFish}>
            {userStore.transferLoading ? '전송 중...' : '물고기 보내기'}
          </Button>
        </div>
      )}
    </StyledDialog>
  );
});

export default TransferModal;
