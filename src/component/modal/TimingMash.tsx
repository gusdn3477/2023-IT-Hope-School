// Clean rebuild of TimingMashModal without duplicated blocks
import { Dialog } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FightBarContainer, TargetZone, CursorZone, FightProgressContainer, FightProgressBar } from '../../pages/Main/Fishing/style';

interface TimingMashModalProps {
  open: boolean;
  onClose: () => void;
  // Optional fine-tuning via config (difficulty scaling from rod/bait/fish)
  config?: TimingMashConfig;
  onComplete: (score: number) => void;
}

export interface TimingMashConfig {
  durationMs?: number; // total survival time (ms)
  initialEnergy?: number; // 0-100
  drainPerSec?: number; // energy drain per second
  regenPerHit?: number; // energy regen per space when overlapping (scaled by overlap ratio)
  hitCooldownMs?: number; // min ms between hits
  targetSpeed?: number; // blue zone speed (px/s)
  cursorSpeed?: number; // yellow zone speed (px/s)
  targetWidth?: number; // blue zone width (px)
  cursorWidth?: number; // yellow zone width (px)
  overlapThreshold?: number; // required overlap ratio 0..1
}

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    width: 680px;
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
  text-align: center;
`;

export default function TimingMashModal({ open, onClose, config, onComplete }: TimingMashModalProps) {
  // Defaults + overrides
  const barWidth = 300;
  const targetWidth = config?.targetWidth ?? 90;
  const cursorWidth = config?.cursorWidth ?? 70;
  const targetSpeed = config?.targetSpeed ?? 360;
  const cursorSpeed = config?.cursorSpeed ?? 540;
  const overlapThreshold = config?.overlapThreshold ?? 0.6;
  const drainPerSec = config?.drainPerSec ?? 14;
  const hitCooldownMs = config?.hitCooldownMs ?? 100;
  const durationMs = config?.durationMs ?? 7000;
  const initialEnergy = Math.max(0, Math.min(100, config?.initialEnergy ?? 100));
  const regenPerHit = config?.regenPerHit ?? 6; // scaled by overlap ratio

  const targetPosRef = useRef(100);
  const cursorPosRef = useRef(0);
  const targetDirRef = useRef(1);
  const cursorDirRef = useRef(1);

  const [targetPos, setTargetPos] = useState(100);
  const [cursorPos, setCursorPos] = useState(0);
  const [remaining, setRemaining] = useState(initialEnergy);

  const remainingRef = useRef(initialEnergy);
  const lastHitTsRef = useRef(0);
  const startTsRef = useRef(0);
  const finishedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const finish = useCallback((ratio: number) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete(Math.max(0, Math.min(1, ratio)));
  }, [onComplete]);

  const computeOverlapRatio = useCallback(() => {
    const aStart = targetPosRef.current;
    const aEnd = aStart + targetWidth;
    const bStart = cursorPosRef.current;
    const bEnd = bStart + cursorWidth;
    const overlap = Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
    const denom = Math.min(targetWidth, cursorWidth);
    return denom > 0 ? overlap / denom : 0;
  }, [targetWidth, cursorWidth]);

  // Space hit handling: only heals while overlapping
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastHitTsRef.current < hitCooldownMs) return;
      const ratio = computeOverlapRatio();
      if (ratio >= overlapThreshold) {
        lastHitTsRef.current = now;
        const heal = regenPerHit * ratio;
        const next = Math.min(100, remainingRef.current + heal);
        remainingRef.current = next;
        setRemaining(next);
      }
    };
    window.addEventListener('keydown', handler, { passive: false });
    return () => window.removeEventListener('keydown', handler);
  }, [open, computeOverlapRatio, overlapThreshold, hitCooldownMs, regenPerHit]);

  // Main loop
  useEffect(() => {
    if (!open) return;
  const initTarget = Math.max(10, Math.min(barWidth - targetWidth - 10, Math.floor(Math.random() * (barWidth - targetWidth))));
    targetPosRef.current = initTarget;
    cursorPosRef.current = 0;
    targetDirRef.current = 1;
    cursorDirRef.current = 1;
    setTargetPos(initTarget);
    setCursorPos(0);
  remainingRef.current = initialEnergy;
  setRemaining(initialEnergy);
    finishedRef.current = false;
    startTsRef.current = performance.now();

    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;

      let tNext = targetPosRef.current + targetDirRef.current * targetSpeed * dt;
      if (tNext <= 0) { tNext = 0; targetDirRef.current = 1; }
      else if (tNext >= barWidth - targetWidth) { tNext = barWidth - targetWidth; targetDirRef.current = -1; }
      targetPosRef.current = tNext;
      setTargetPos(tNext);

      let cNext = cursorPosRef.current + cursorDirRef.current * cursorSpeed * dt;
      if (cNext <= 0) { cNext = 0; cursorDirRef.current = 1; }
      else if (cNext >= barWidth - cursorWidth) { cNext = barWidth - cursorWidth; cursorDirRef.current = -1; }
      cursorPosRef.current = cNext;
      setCursorPos(cNext);

      const nextRemain = Math.max(0, remainingRef.current - drainPerSec * dt);
      remainingRef.current = nextRemain;
      setRemaining(nextRemain);

      const elapsed = now - startTsRef.current;
      // Survival rule: if bar hits 0 before time ends -> lose (0), else if survive full duration -> win with ratio (remaining%)
      if (nextRemain <= 0) { finish(0); return; }
      if (elapsed >= durationMs) { finish(remainingRef.current / 100); return; }

      if (!finishedRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [open, durationMs, finish, targetSpeed, cursorSpeed, targetWidth, cursorWidth, initialEnergy, drainPerSec]);

  const remainingSec = Math.max(0, Math.ceil((durationMs - (performance.now() - startTsRef.current)) / 1000));

  return (
    <StyledDialog open={open} onClose={onClose} disableScrollLock>
      <Wrapper>
        <Hint>
          파란(목표)과 노란(커서)이 겹칠 때 스페이스바 연타로 게이지 회복!
          <br/>게이지가 0% 되기 전에 {Math.ceil(durationMs/1000)}초 버티면 승리
          <br/>에너지 {Math.round(remaining)}% • 남은 시간 {remainingSec}초
        </Hint>
        <FightBarContainer>
          <TargetZone position={targetPos} width={targetWidth} />
          <CursorZone position={cursorPos} width={cursorWidth} />
        </FightBarContainer>
        <FightProgressContainer>
          <FightProgressBar progress={remaining} />
        </FightProgressContainer>
      </Wrapper>
    </StyledDialog>
  );
}
