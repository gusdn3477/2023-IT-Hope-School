import { Dialog } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FightBarContainer, SuccessZone, Marker } from '../../pages/Main/Fishing/style';

interface TimingModalProps {
  open: boolean;
  onClose: () => void;
  durationMs?: number; // default 2500
  onComplete: (score: number) => void; // 0..1
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 640px;
    max-width: none;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    border-radius: 12px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
`;

const Hint = styled.div`
  font-family: 'Neo둥근모';
  font-size: 18px;
  opacity: 0.95;
`;

export const TimingModal = ({ open, onClose, durationMs = 2500, onComplete }: TimingModalProps) => {
  const barWidth = 300; // must match FightBarContainer style width
  const markerSpeed = 480; // px/sec
  const zoneWidth = 70; // px

  const [zonePos, setZonePos] = useState(100);
  const [markerPos, setMarkerPos] = useState(0);
  const [dir, setDir] = useState(1); // 1: right, -1: left
  const startedRef = useRef<number>(0);
  const pressedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const finish = useCallback((score: number) => {
    if (pressedRef.current) return; // already finished
    pressedRef.current = true;
    onComplete(Math.max(0, Math.min(1, score)));
  }, [onComplete]);

  // Key handler: space to judge
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      // compute score relative to success zone
      const center = markerPos;
      const zoneStart = zonePos;
      const zoneEnd = zonePos + zoneWidth;
      let score = 0;
      if (center >= zoneStart && center <= zoneEnd) {
        score = 1;
      } else {
        const dist = center < zoneStart ? (zoneStart - center) : (center - zoneEnd);
        // linear falloff: 0 at half bar away, clamp
        const maxDist = barWidth / 2;
        score = Math.max(0, 1 - dist / maxDist);
      }
      finish(score);
    };
    window.addEventListener('keydown', onKey, { passive: false });
    return () => window.removeEventListener('keydown', onKey);
  }, [open, markerPos, zonePos, finish]);

  // Animation loop
  useEffect(() => {
    if (!open) return;
    // randomize at open
    setZonePos(Math.max(10, Math.min(barWidth - zoneWidth - 10, Math.floor(Math.random() * (barWidth - zoneWidth)))));
    setMarkerPos(0);
    setDir(1);
    pressedRef.current = false;
    startedRef.current = performance.now();

    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = (now - last) / 1000; // sec
      last = now;
      // move marker
      setMarkerPos(prev => {
        let next = prev + dir * markerSpeed * dt;
        if (next <= 0) {
          next = 0; setDir(1);
        } else if (next >= barWidth) {
          next = barWidth; setDir(-1);
        }
        return next;
      });

      // timeout
      if (!pressedRef.current && now - startedRef.current >= durationMs) {
        finish(0); // missed
        return;
      }

      if (!pressedRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // dir changes inside the loop via setDir; we intentionally avoid adding it to dependencies
  // to prevent resetting the animation mid-run. State updates use functional form.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, durationMs, finish]);

  return (
    <StyledDialog open={open} onClose={onClose} disableScrollLock>
      <Wrapper>
        <Hint>녹색 구간에서 스페이스바를 누르세요!</Hint>
        <FightBarContainer>
          <SuccessZone position={zonePos} width={zoneWidth} />
          <Marker position={markerPos} />
        </FightBarContainer>
        <div style={{ fontFamily: 'Neo둥근모' }}>남은 시간: {Math.max(0, Math.ceil((durationMs - (performance.now() - startedRef.current))/1000))}초</div>
      </Wrapper>
    </StyledDialog>
  );
};

export default TimingModal;