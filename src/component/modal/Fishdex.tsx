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
} from '@mui/material';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import type { FishDexEntry } from '../../stores/FishingStore';

interface FishdexProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 800px;
    max-width: none;
  }
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

export const FishdexModal = observer(({ open, onClose }: FishdexProps) => {
  const { fishingStore } = useStore();
  const [fishData, setFishData] = useState<FishDexEntry[]>([]);

  useEffect(() => {
    if (!open) return;
    const fetchFishData = async () => {
      await fishingStore.getEncyclopedia();
      setFishData([...fishingStore.caughtFish]);
    };
    fetchFishData();
  }, [open, fishingStore]);

  const completion = `${fishData.filter(f => f.caught).length} / ${fishData.length}`;

  return (
    <StyledDialog onClose={onClose} open={open} disableScrollLock>
      <DialogTitle style={{ textAlign: 'center', fontFamily: 'Neo둥근모' }}>
        물고기 도감 (완성도: {completion})
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: (t) => t.palette.grey[500] }}
      >
        <CloseIcon />
      </IconButton>
      <Table>
        <TableHead>
          <TableRow>
            <StyledCell align="center">이름</StyledCell>
            <StyledCell align="center">레벨</StyledCell>
            <StyledCell align="center">가격</StyledCell>
            <StyledCell align="center">획득</StyledCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fishData.map((f) => (
            <TableRow key={f.id}>
              <StyledCell align="center">{f.name}</StyledCell>
              <StyledCell align="center">{f.level}</StyledCell>
              <StyledCell align="center">{f.price}원</StyledCell>
              <StyledCell align="center" style={{ color: f.caught ? 'green' : 'gray' }}>
                {f.caught ? '획득' : '미발견'}
              </StyledCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledDialog>
  );
});

export default FishdexModal;
