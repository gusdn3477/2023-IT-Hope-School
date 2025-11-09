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
  CircularProgress,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 720px;
    max-width: none;
  }
`;

const StyledCell = styled(TableCell)`
  font-family: 'Neo둥근모';
`;

export const LeaderboardModal = observer(({ open, onClose }: LeaderboardProps) => {
  const { userStore } = useStore();
  const [tab, setTab] = useState<'all' | 'weekly'>('all');

  useEffect(() => {
    if (!open) return;
    // Load both leaderboards initially for snappy tab switch
    userStore.loadLeaderboard(100, 'all');
    userStore.loadLeaderboard(100, 'weekly');
  }, [open, userStore]);

  const entries = tab === 'weekly' ? userStore.leaderboardWeekly : userStore.leaderboardAll;

  type WeeklyEntry = typeof userStore.leaderboardWeekly[number];

  return (
    <StyledDialog onClose={onClose} open={open} disableScrollLock>
      <DialogTitle style={{ textAlign: 'center', fontFamily: 'Neo둥근모' }}>리더보드</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: (t) => t.palette.grey[500] }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ px: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="영구 랭킹" value="all" sx={{ fontFamily: 'Neo둥근모' }} />
          <Tab label="위클리 랭킹" value="weekly" sx={{ fontFamily: 'Neo둥근모' }} />
        </Tabs>
      </Box>

      {userStore.leaderboardLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <CircularProgress />
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <StyledCell align="center">순위</StyledCell>
              <StyledCell align="center">닉네임</StyledCell>
              {tab === 'weekly' ? (
                <>
                  <StyledCell align="center">주간 어획</StyledCell>
                  <StyledCell align="center">주간 수익</StyledCell>
                  <StyledCell align="center">레벨</StyledCell>
                  <StyledCell align="center">낚싯대</StyledCell>
                </>
              ) : (
                <>
                  <StyledCell align="center">레벨</StyledCell>
                  <StyledCell align="center">낚싯대</StyledCell>
                  <StyledCell align="center">도감</StyledCell>
                  <StyledCell align="center">보유금</StyledCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={`${e.playerId}`}>
                <StyledCell align="center">{e.rank}</StyledCell>
                <StyledCell align="center">{e.nickname}</StyledCell>
                {tab === 'weekly' ? (
                  (() => {
                    const we = e as WeeklyEntry;
                    return (
                      <>
                        <StyledCell align="center">{we.weeklyFishCaught}마리</StyledCell>
                        <StyledCell align="center">{we.weeklyMoneyEarned.toLocaleString()}원</StyledCell>
                        <StyledCell align="center">Lv {we.level}</StyledCell>
                        <StyledCell align="center">Rod {we.rodLevel}</StyledCell>
                      </>
                    );
                  })()
                ) : (
                  <>
                    <StyledCell align="center">Lv {e.level}</StyledCell>
                    <StyledCell align="center">Rod {e.rodLevel}</StyledCell>
                    <StyledCell align="center">{e.dexCount}</StyledCell>
                    <StyledCell align="center">{e.money.toLocaleString()}원</StyledCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </StyledDialog>
  );
});

export default LeaderboardModal;
