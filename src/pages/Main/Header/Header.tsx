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

export const Header = observer(() => {
  const [marketOpen, setMarketOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { uiStore } = useStore();

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
            <Button variant="contained">잠들기</Button>
            <Button variant="contained" onClick={() => setMarketOpen(true)}>
              상점
            </Button>
            <Button variant="contained" onClick={() => setItemOpen(true)}>
              아이템
            </Button>
            <Button
              variant="contained"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              메뉴
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
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </>
  );
});
