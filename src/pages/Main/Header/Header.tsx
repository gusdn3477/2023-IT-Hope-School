import { ItemsModal } from '../../../component/modal/Items';
import { MarketModal } from '../../../component/modal/Market';
import { OutletWrapper, StyledHeader } from './style';
import { Outlet } from 'react-router-dom';

export const Header = () => {
  return (
    <>
      <StyledHeader>
        <div>헤더</div>
        <div style={{ display: 'flex' }}>
          <div>도움말</div>
          <div>상점</div>
          <div>아이템</div>
          <div>메뉴</div>
        </div>
      </StyledHeader>
      {/* <ItemsModal
        open={true}
        onClose={() => console.log('zz')}
        selectedValue="123"
      /> */}
      {/* <MarketModal /> */}
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </>
  );
};
