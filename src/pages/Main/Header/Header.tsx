import { useState } from 'react';
import { ItemsModal } from '../../../component/modal/Items';
import { MarketModal } from '../../../component/modal/Market';
import { OutletWrapper, StyledHeader } from './style';
import { Outlet } from 'react-router-dom';
import gameLogo from '/logo.png';
import { MenuPopover } from '../../../component/popover/Menu';
import { Button, ListItem } from '@mui/material';
import coin from '../../../assets/coin.png';
import { observer } from 'mobx-react-lite';

export const Header = observer(() => {
  const [marketOpen, setMarketOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
    <>
      <StyledHeader>
        <img src={gameLogo} width={50} height={50} />
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <strong>게임 시작한 지 : 4일</strong>
            <strong>
              <img src={coin} width={24} height={24} />
            </strong>
            <strong>1000원</strong>
            <strong>포인트 : 500점</strong>
          </div>
          <div>
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
          </div>
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
});
