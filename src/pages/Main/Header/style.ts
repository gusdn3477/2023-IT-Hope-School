import styled from '@emotion/styled';
import background from '../../../assets/gamebg.png';

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 72px;
  background-color: blue;
`;

export const OutletWrapper = styled.div`
  width: 100%;
  height: calc(100% - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${background});
  background-size: 100%;
`;

export const StyledButtonWrapper = styled('div')`
  & button {
    margin: 6px;
  }
`;

export const HeaderTitleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  & strong {
    margin-right: 8px;
  }
`;
