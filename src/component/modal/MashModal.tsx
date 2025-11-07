import { Dialog } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface MashModalProps {
  open: boolean;
  onClose: () => void;
  durationMs?: number; // default 3000
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
  gap: 16px;
  padding: 24px;
`;

const Bar = styled.div`
  width: 100%;
  height: 18px;
  background: rgba(255,255,255,0.15);
  border-radius: 999px;
  overflow: hidden;
`;

const Fill = styled.div<{ pct: number }>`
  width: ${({ pct }) => Math.min(100, Math.max(0, pct))}%;
  height: 100%;
  background: linear-gradient(90deg, #4FC3F7, #29B6F6);
  transition: width 100ms linear;
`;

const Hint = styled.div`
  font-family: 'Neo둥근모';
  font-size: 18px;
  opacity: 0.9;
`;

export const MashModal = ({ open, onClose, durationMs = 3000, onComplete }: MashModalProps) => {
  const [count, setCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  // target presses per second baseline for full score (tune as needed)
  const targetPerSec = 8; // 8 cps gives score ~1
  const pct = Math.min(1, (count / Math.max(1, (elapsed/1000) * targetPerSec)));

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        // prevent page scroll when pressing space
        e.preventDefault();
        setCount(c => c + 1);
      }
    };
    window.addEventListener('keydown', handleKey, { passive: false });

    const started = Date.now();
    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const el = now - started;
      setElapsed(el);
      if (el >= durationMs) {
        window.clearInterval(timerRef.current!);
        window.removeEventListener('keydown', handleKey);
        // final score clamp 0..1
        const totalTarget = (durationMs / 1000) * targetPerSec;
        const score = Math.max(0, Math.min(1, count / Math.max(1, totalTarget)));
        onComplete(score);
      }
    }, 100);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      window.removeEventListener('keydown', handleKey);
    };
  // We intentionally do not include `count` to avoid resetting the game mid-session.
  // Using functional setState for count avoids stale closure issues.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, durationMs, onComplete]);

  return (
    <StyledDialog open={open} onClose={onClose} disableScrollLock>
      <Wrapper>
        <Hint>스페이스바를 연타해서 물고기를 당겨오세요!</Hint>
        <Bar>
          <Fill pct={pct * 100} />
        </Bar>
        <div style={{ fontFamily: 'Neo둥근모' }}>남은 시간: {Math.max(0, Math.ceil((durationMs - elapsed)/1000))}초 | 타수: {count}</div>
      </Wrapper>
    </StyledDialog>
  );
};

export default MashModal;
