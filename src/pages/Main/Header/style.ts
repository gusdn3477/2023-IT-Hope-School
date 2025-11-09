import styled from '@emotion/styled';
import background from '../../../assets/sea.png';

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 72px;
  background-color: blue;
  padding: 0 16px;

  @media (max-width: 640px) {
    flex-wrap: wrap;
    height: auto;
    gap: 8px;
    padding: 8px 12px;
  }
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

  @media (max-width: 640px) {
    height: calc(100% - 32px - 110px); /* header grows when wrapped */
    padding: 0 8px 32px;
    background-size: cover;
  }
`;

export const StyledButtonWrapper = styled('div')`
  & button {
    margin: 6px;
  }

  @media (max-width: 640px) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    & button {
      flex: 1 1 calc(50% - 12px);
      min-width: 140px;
      margin: 4px;
      font-size: 12px;
      padding: 6px 4px;
    }
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

  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-start;
    font-size: 14px;
    & strong { margin-right: 4px; }
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

  @media (max-width: 640px) {
    flex-wrap: wrap;
    height: auto;
    padding: 6px 8px 8px;
    gap: 6px;
    font-size: 11px;
    justify-content: space-around;
  }
`;
