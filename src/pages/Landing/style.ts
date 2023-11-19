import styled from '@emotion/styled';

export const LandingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const ButtonWrapper = styled.div`
  width: 320px;
  height: 220px;
  display: flex;
  align-items: center;
  flex-direction: column;
  & button {
    margin-top: 35px;
  }
`;

export const StyledButton = styled.button`
  width: 240px;
  height: 80px;
  cursor: pointer;
`;
