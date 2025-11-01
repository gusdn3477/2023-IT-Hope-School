import styled from 'styled-components';

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  background-size: cover;
  position: relative;
`;

export const GameInner = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 0 12px; /* 작은 좌우 패딩으로 시각적 균형 */
`;
export const InfoPanel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: 'neodgm', sans-serif;
`;

export const BiteIndicator = styled.div`
  font-size: 50px;
  color: red;
  animation: blink 1s infinite;
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

export const FightBarContainer = styled.div`
  width: 300px;
  height: 30px;
  border: 2px solid #000;
  background-color: #ccc;
  position: relative;
  margin-top: 20px;
`;

export const SuccessZone = styled.div<{ position: number; width: number }>`
  width: ${({ width }) => width}px;
  height: 100%;
  background-color: green;
  position: absolute;
  left: ${({ position }) => position}px;
`;

export const Marker = styled.div<{ position: number }>`
  width: 10px;
  height: 100%;
  background-color: yellow;
  position: absolute;
  left: ${({ position }) => position}px;
`;

export const FightProgressContainer = styled.div`
  width: 300px;
  height: 20px;
  border: 2px solid #000;
  background-color: #ccc;
  margin-top: 10px;
`;

export const FightProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background-color: blue;
`;
