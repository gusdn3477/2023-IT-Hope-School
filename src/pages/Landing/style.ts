import styled from '@emotion/styled';
import background from '../../assets/sea.png';
import { keyframes } from '@emotion/react';

export const LandingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
`;

export const ButtonWrapper = styled.div`
  width: 320px;
  height: 220px;
  display: flex;
  align-items: center;
  flex-direction: column;
  & img {
    margin-top: 35px;
  }
`;

export const StyledButton = styled.button`
  width: 240px;
  height: 90px;
  cursor: pointer;
`;

// Intro animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const popIn = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

export const IntroOverlay = styled.div<{ closing?: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  animation: ${fadeIn} 400ms ease-out;
  ${props => props.closing ? `animation: ${fadeOut} 450ms ease-in forwards;` : ''}
`;

export const IntroBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  color: #fff;
  font-family: 'Neo둥근모';
`;

export const IntroLogo = styled.img`
  width: 360px;
  animation: ${popIn} 700ms ease-out;
`;

export const IntroHint = styled.div`
  opacity: 0.9;
  font-size: 16px;
`;

export const IntroVideo = styled.video`
  width: 640px;
  max-width: 80vw;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0,0,0,0.6);
  margin-bottom: 18px;
`;

export const ButtonsFadeContainer = styled.div`
  transition: opacity 450ms ease;
`;
