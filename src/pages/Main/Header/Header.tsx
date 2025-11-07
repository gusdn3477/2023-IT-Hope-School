import { useState } from 'react';
import { HeaderTitleWrapper, OutletWrapper, StyledButtonWrapper, StyledHeader, InfoStrip } from './style';
import { Outlet } from 'react-router-dom';
import gameLogo from '../../../assets/logo2.png';
import { MenuPopover } from '../../../component/popover/Menu';
import { Button, Menu, MenuItem } from '@mui/material';
import coin from '../../../assets/coin.png';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/useStore';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import MenuIcon from '@mui/icons-material/Menu';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { FishdexModal } from '../../../component/modal/Fishdex';
import SellFishModal from '../../../component/modal/SellFish';
import RodUpgradeModal from '../../../component/modal/RodUpgrade';
import BaitShopModal from '../../../component/modal/BaitShop';
import { fishingStore } from '../../../stores/FishingStore';
import { FISH } from '../../../constants/fish';
import { BAITS } from '../../../constants/bait';

export const Header = observer(() => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fishdexOpen, setFishdexOpen] = useState(false);
  const [fishMenuAnchorEl, setFishMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [sellOpen, setSellOpen] = useState(false);
  const [rodOpen, setRodOpen] = useState(false);
  const [baitOpen, setBaitOpen] = useState(false);
  const { userStore } = useStore();

  return (
    <>
      <StyledHeader>
        <div style={{ display: 'flex' }}>
          <img src={gameLogo} style={{ width: '96px', marginLeft: '6px' }} />
        </div>
        <div style={{ display: 'flex' }}>
          <HeaderTitleWrapper>
            <strong style={{ display: 'flex', alignItems: 'center' }}>
              <img src={coin} width={24} height={24} />
              <strong>{userStore.user?.money ?? 0}원</strong>
            </strong>
          </HeaderTitleWrapper>
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
              onClick={() => setFishdexOpen(true)}
              style={{ fontFamily: 'Neo둥근모' }}
            >
              도감 <LibraryBooksIcon style={{ width: '20px', height: '20px' }} />
            </Button>
            <Button
              variant="contained"
              onClick={() => setBaitOpen(true)}
              style={{ fontFamily: 'Neo둥근모' }}
            >
              미끼 상점{' '}
              <LocalGroceryStoreIcon style={{ width: '20px', height: '20px' }} />
            </Button>
            <Button
              variant="contained"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              style={{ fontFamily: 'Neo둥근모' }}
            >
              메뉴 <MenuIcon style={{ width: '20px', height: '20px' }} />
            </Button>
          </StyledButtonWrapper>
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
        <span>낚시터 {fishingStore.groundLevel} / 도감 {fishingStore.caughtFish.length}/{Object.keys(FISH).length}</span>
      </InfoStrip>
      <Menu anchorEl={fishMenuAnchorEl} open={Boolean(fishMenuAnchorEl)} onClose={() => setFishMenuAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setSellOpen(true);
            setFishMenuAnchorEl(null);
          }}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          판매
        </MenuItem>
        <MenuItem
          onClick={() => {
            setRodOpen(true);
            setFishMenuAnchorEl(null);
          }}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          낚싯대 강화
        </MenuItem>
        <MenuItem
          onClick={() => {
            fishingStore.unlock();
            setFishMenuAnchorEl(null);
          }}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          낚시터 확장
        </MenuItem>
      </Menu>
      <MenuPopover anchorEl={anchorEl} handleClose={() => setAnchorEl(null)} />
      <FishdexModal open={fishdexOpen} onClose={() => setFishdexOpen(false)} />
      <SellFishModal open={sellOpen} onClose={() => setSellOpen(false)} />
      <RodUpgradeModal open={rodOpen} onClose={() => setRodOpen(false)} />
      <BaitShopModal open={baitOpen} onClose={() => setBaitOpen(false)} />
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </>
  );
});
