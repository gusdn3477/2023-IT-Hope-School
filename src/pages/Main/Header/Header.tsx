import { useState, useEffect } from 'react';
import { HeaderTitleWrapper, OutletWrapper, StyledButtonWrapper, StyledHeader, InfoStrip } from './style';
import { Outlet, useSearchParams } from 'react-router-dom';
import gameLogo from '../../../assets/IT_HOPE_FISHING.png';
import { MenuPopover } from '../../../component/popover/Menu';
import { Button, Menu, MenuItem, Drawer, List, ListItem, ListItemText, IconButton, useMediaQuery } from '@mui/material';
import coin from '../../../assets/coin.png';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/useStore';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import MenuIcon from '@mui/icons-material/Menu';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LeaderboardIcon from '@mui/icons-material/EmojiEvents';
import { FishdexModal } from '../../../component/modal/Fishdex';
import SellFishModal from '../../../component/modal/SellFish';
import RodUpgradeModal from '../../../component/modal/RodUpgrade';
import LeaderboardModal from '../../../component/modal/Leaderboard';
import TransferModal from '../../../component/modal/Transfer';
import BaitShopModal from '../../../component/modal/BaitShop';
import { fishingStore } from '../../../stores/FishingStore';
import { FISH } from '../../../constants/fish';
import { BAITS } from '../../../constants/bait';

export const Header = observer(() => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // URL 기반 모달 상태 관리 (query param: ?modal=<name>)
  const [searchParams, setSearchParams] = useSearchParams();
  const [fishMenuAnchorEl, setFishMenuAnchorEl] = useState<null | HTMLElement>(null);
  // Drawer 상태도 URL로 관리 (?drawer=main)
  const { userStore } = useStore();
  const isMobile = useMediaQuery('(max-width:640px)');

  // 도감 진행도는 백엔드의 fishList(= discovered) 기준
  useEffect(() => {
    // 로그인 후 또는 첫 렌더링 시 한 번 로드
    if (userStore.user?.id) {
      // 이미 로드되어 있으면 생략
      if (fishingStore.caughtFish.length === 0) {
        fishingStore.getEncyclopedia();
      }
    }
  }, [userStore.user?.id]);

  // helper: 모달 param 설정
  const setModal = (modal?: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (modal) {
      next.set('modal', modal);
    } else {
      next.delete('modal');
    }
    setSearchParams(next);
  };

  const activeModal = searchParams.get('modal');
  const fishdexOpen = activeModal === 'fishdex';
  const sellOpen = activeModal === 'sell';
  const rodOpen = activeModal === 'rod-upgrade';
  const baitOpen = activeModal === 'bait-shop';
  const leaderboardOpen = activeModal === 'leaderboard';
  const transferOpen = activeModal === 'transfer';

  const drawerOpen = searchParams.get('drawer') === 'main';
  const setDrawer = (open: boolean) => {
    const next = new URLSearchParams(searchParams.toString());
    if (open) next.set('drawer', 'main');
    else next.delete('drawer');
    setSearchParams(next);
  };

  return (
    <>
      <StyledHeader>
        <div style={{ display: 'flex' }}>
          <img src={gameLogo} width={96} height={70}/>
        </div>
        <div style={{ display: 'flex' }}>
          <HeaderTitleWrapper>
            <strong style={{ display: 'flex', alignItems: 'center' }}>
              <img src={coin} width={24} height={24} />
              <strong>{userStore.user?.money ?? 0}원</strong>
            </strong>
          </HeaderTitleWrapper>
          {!isMobile ? (
            <StyledButtonWrapper>
              <Button
                variant="contained"
                onClick={(e) => setFishMenuAnchorEl(e.currentTarget)}
                style={{ fontFamily: 'Neo둥근모' }}
              >
                낚시
              </Button>
              <Button
                variant="contained"
                onClick={() => setModal('fishdex')}
                style={{ fontFamily: 'Neo둥근모' }}
              >
                도감 <LibraryBooksIcon style={{ width: '20px', height: '20px' }} />
              </Button>
              <Button
                variant="contained"
                onClick={() => setModal('leaderboard')}
                style={{ fontFamily: 'Neo둥근모' }}
              >
                리더보드 <LeaderboardIcon style={{ width: '20px', height: '20px' }} />
              </Button>
              <Button
                variant="contained"
                onClick={() => setModal('bait-shop')}
                style={{ fontFamily: 'Neo둥근모' }}
              >
                미끼 상점{' '}
                <LocalGroceryStoreIcon style={{ width: '20px', height: '20px' }} />
              </Button>
              <Button
                variant="contained"
                onClick={() => setModal('transfer')}
                style={{ fontFamily: 'Neo둥근모' }}
              >
                송금
              </Button>
              <Button
                variant="contained"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                style={{ fontFamily: 'Neo둥근모' }}
              >
                메뉴 <MenuIcon style={{ width: '20px', height: '20px' }} />
              </Button>
            </StyledButtonWrapper>
          ) : (
            <div>
              <IconButton
                onClick={() => setDrawer(true)}
                sx={{ color: '#fff', background: 'rgba(255,255,255,0.15)', '&:hover': { background: 'rgba(255,255,255,0.3)' } }}
              >
                <MenuIcon />
              </IconButton>
            </div>
          )}
        </div>
      </StyledHeader>
      <InfoStrip>
        <span>낚싯대 Lv {fishingStore.rodLevel}</span>
        <span>|</span>
        <span>
          {(() => {
            const bait = BAITS[fishingStore.selectedBaitId as keyof typeof BAITS];
            return `미끼: ${bait?.name ?? '없음'} (${fishingStore.baitInventory?.[fishingStore.selectedBaitId] ?? 0})`;
          })()}
        </span>
    <span>|</span>
    <span>도감 {fishingStore.dexSeenCount}/{Object.keys(FISH).length}</span>
      </InfoStrip>
      <Menu anchorEl={fishMenuAnchorEl} open={Boolean(fishMenuAnchorEl)} onClose={() => setFishMenuAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setModal('sell');
            setFishMenuAnchorEl(null);
          }}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          판매
        </MenuItem>
        <MenuItem
          onClick={() => {
            setModal('rod-upgrade');
            setFishMenuAnchorEl(null);
          }}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          낚싯대 강화
        </MenuItem>
        {/* 낚시터 해금 버튼 제거 (rodLevel 기반 자동/명시 해금으로 변경됨) */}
      </Menu>
      <MenuPopover anchorEl={anchorEl} handleClose={() => setAnchorEl(null)} />
      {/* 모바일 햄버거 메뉴 */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawer(false)} disableScrollLock>
        <div style={{ width: 260 }}>
          <List>
            <ListItem button onClick={() => { setModal('fishdex'); setDrawer(false); }}>
              <ListItemText primary="도감" />
            </ListItem>
            <ListItem button onClick={() => { setModal('leaderboard'); setDrawer(false); }}>
              <ListItemText primary="리더보드" />
            </ListItem>
            <ListItem button onClick={() => { setModal('bait-shop'); setDrawer(false); }}>
              <ListItemText primary="미끼 상점" />
            </ListItem>
            <ListItem button onClick={() => { setModal('transfer'); setDrawer(false); }}>
              <ListItemText primary="송금" />
            </ListItem>
            <ListItem button onClick={() => { setModal('sell'); setDrawer(false); }}>
              <ListItemText primary="판매" />
            </ListItem>
            <ListItem button onClick={() => { setModal('rod-upgrade'); setDrawer(false); }}>
              <ListItemText primary="낚싯대 강화" />
            </ListItem>
            <ListItem button onClick={() => { userStore.logout(); setDrawer(false); }}>
              <ListItemText primary="로그아웃" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    <FishdexModal open={fishdexOpen} onClose={() => setModal(undefined)} />
    <SellFishModal open={sellOpen} onClose={() => setModal(undefined)} />
    <RodUpgradeModal open={rodOpen} onClose={() => setModal(undefined)} />
    <BaitShopModal open={baitOpen} onClose={() => setModal(undefined)} />
    <LeaderboardModal open={leaderboardOpen} onClose={() => setModal(undefined)} />
    <TransferModal open={transferOpen} onClose={() => setModal(undefined)} />
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </>
  );
});
