import { OutletWrapper, StyledHeader } from './style';
import { Outlet } from 'react-router-dom';

export const Header = () => {
  return (
    <>
      <StyledHeader>헤더</StyledHeader>
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </>
  );
};
