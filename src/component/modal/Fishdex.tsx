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
import { FISH_LIST, getSeasonFromDay, Season } from '../../constants/fish';
import { useStore } from '../../hooks/useStore';
import { fishingStore } from '../../stores/FishingStore';

interface FishdexProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 800px;
    max-width: none;
  }
`;

const StyledCell = styled(TableCell)`
  font-family: 'Neo둥근모';
`;

export const FishdexModal = observer(({ open, onClose }: FishdexProps) => {
  const { userStore } = useStore();
  const us = userStore as unknown as { user?: { day?: number } };
  const day = us.user?.day ?? 1;
  const season: Season = getSeasonFromDay(day);
  const completion = `${fishingStore.caughtFish.length} / ${FISH_LIST.length}`;

  return (
    <StyledDialog onClose={onClose} open={open} disableScrollLock>
      <DialogTitle style={{ textAlign: 'center', fontFamily: 'Neo둥근모' }}>
        물고기 도감 (완성도: {completion}) - 현재 계절: {season}
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
            <StyledCell align="center">계절</StyledCell>
            <StyledCell align="center">낚시터</StyledCell>
            <StyledCell align="center">획득</StyledCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {FISH_LIST.map((f) => {
            const caught = fishingStore.caughtFish.includes(f.id);
            const now = f.seasons.includes(season);
            return (
              <TableRow key={f.id}>
                <StyledCell align="center">{f.name}</StyledCell>
                <StyledCell align="center">{f.level}</StyledCell>
                <StyledCell align="center">{f.price}원</StyledCell>
                <StyledCell align="center">{f.seasons.join(', ')}</StyledCell>
                <StyledCell align="center">{f.ground}번</StyledCell>
                <StyledCell align="center" style={{ color: caught ? 'green' : now ? 'orange' : 'gray' }}>
                  {caught ? '획득' : now ? '가능' : '미발견'}
                </StyledCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </StyledDialog>
  );
});

export default FishdexModal;
