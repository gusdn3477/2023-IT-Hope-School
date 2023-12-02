import { useState } from 'react';
import { ItemsModal } from '../../../component/modal/Items';
import { MarketModal } from '../../../component/modal/Market';
import {
  HeaderTitleWrapper,
  OutletWrapper,
  StyledButtonWrapper,
  StyledHeader,
} from './style';
import { Outlet } from 'react-router-dom';
import gameLogo from '/logo.png';
import { MenuPopover } from '../../../component/popover/Menu';
import { Button } from '@mui/material';
import coin from '../../../assets/coin.png';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/useStore';
import SleepModal from '../../../component/modal/Sleep';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export const Header = observer(() => {
  const [marketOpen, setMarketOpen] = useState(false);
  const [sleepModalOpen, setSleepModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { uiStore } = useStore();

  const handleClickSleep = () => {
    setSleepModalOpen(true);
  };

  return (
    <>
      <StyledHeader>
        <img src={gameLogo} width={50} height={50} />
        <div style={{ display: 'flex' }}>
          <HeaderTitleWrapper>
            <strong>게임 시작한 지 : 4일</strong>
            <strong style={{ display: 'flex', alignItems: 'center' }}>
              <img src={coin} width={24} height={24} />
              <strong>1000원</strong>
            </strong>
            <strong>포인트 : 500점</strong>
          </HeaderTitleWrapper>
          <StyledButtonWrapper>
            <Button
              onClick={handleClickSleep}
              variant="contained"
              style={{ fontFamily: 'Neo둥근모' }}
            >
              잠들기 <BedtimeIcon />
            </Button>
            <Button
              variant="contained"
              onClick={() => setMarketOpen(true)}
              style={{ fontFamily: 'Neo둥근모' }}
            >
              상점 <LocalGroceryStoreIcon />
            </Button>
            <Button
              variant="contained"
              onClick={() => uiStore.setOpenItemModal(true)}
              style={{ fontFamily: 'Neo둥근모' }}
            >
              아이템 <ShoppingBagIcon />
            </Button>
            <Button
              variant="contained"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              style={{ fontFamily: 'Neo둥근모' }}
            >
              메뉴 <MenuIcon />
            </Button>
          </StyledButtonWrapper>
        </div>
      </StyledHeader>
      <MenuPopover anchorEl={anchorEl} handleClose={() => setAnchorEl(null)} />
      <ItemsModal
        open={uiStore.openItemModal}
        onClose={() => {
          uiStore.setOpenItemModal(false);
          uiStore.setSelectedFarmId(-1);
        }}
      />
      <MarketModal open={marketOpen} onClose={() => setMarketOpen(false)} />
      <SleepModal
        open={sleepModalOpen}
        onClose={() => setSleepModalOpen(false)}
      />
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </>
  );
});
