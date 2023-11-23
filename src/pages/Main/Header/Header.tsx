import { useState } from 'react';
import { ItemsModal } from '../../../component/modal/Items';
import { MarketModal } from '../../../component/modal/Market';
import { OutletWrapper, StyledHeader } from './style';
import { Outlet } from 'react-router-dom';
import gameLogo from '/logo.png';
import { MenuPopover } from '../../../component/popover/Menu';
import { Button, ListItem } from '@mui/material';

export const Header = () => {
  const [marketOpen, setMarketOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
    <>
      <StyledHeader>
        <img src={gameLogo} width={50} height={50} />
        <div style={{ display: 'flex' }}>
          <ListItem>게임 시작한 지 : 4일</ListItem>
          <ListItem>가진 돈 : 1000원</ListItem>
          <ListItem>포인트 : 500점</ListItem>

          <Button variant="contained" sx={{ width: '250px' }}>
            잠들기
          </Button>
          <Button
            variant="contained"
            sx={{ width: '250px' }}
            onClick={() => setMarketOpen(true)}
          >
            상점
          </Button>
          <Button
            variant="contained"
            sx={{ width: '250px' }}
            onClick={() => setItemOpen(true)}
          >
            아이템
          </Button>
          <Button
            variant="contained"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            메뉴
          </Button>
        </div>
      </StyledHeader>
      <MenuPopover anchorEl={anchorEl} handleClose={() => setAnchorEl(null)} />
      <ItemsModal
        open={itemOpen}
        onClose={() => setItemOpen(false)}
        selectedValue="123"
      />
      <MarketModal
        open={marketOpen}
        onClose={() => setMarketOpen(false)}
        selectedValue="123"
      />
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </>
  );
};
