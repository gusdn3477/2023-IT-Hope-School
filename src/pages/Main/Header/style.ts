import styled from '@emotion/styled';
import background from '../../../assets/sea.png';

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
  /* Header(72px) + InfoStrip(32px) accounted for to maintain visual vertical centering */
  height: calc(100% - 72px - 32px);
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

export const InfoStrip = styled('div')`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  font-size: 12px;
  gap: 12px;
`;
