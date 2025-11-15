import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import sea from '../../../assets/sea.png';
import fishingTitle from '../../../assets/IT_HOPE_FISHING.png';
import ResultModal from '../../../component/modal/ResultModal';
import TimingMashModal, { TimingMashConfig } from '../../../component/modal/TimingMash';
import EncounterModal from '../../../component/modal/Encounter';
import { useStore } from '../../../hooks/useStore';
import { observer } from 'mobx-react-lite';
import { BAITS } from '../../../constants/bait';
import { FISH_IMAGES } from '../../../constants/fishImages';
import { GameContainer, GameInner } from './style';

const StyledTitle = styled.img`
  width: 400px;
  margin-bottom: 20px;
`;

const HookOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const HookInner = styled.div`
  position: relative;
  width: min(800px, 88vw);
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
`;

const HookVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HookResultText = styled.div<{ success: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  font-weight: 900;
  color: ${(p) => (p.success ? '#3CFF7A' : '#FF4D4F')};
  text-shadow: 0 4px 16px rgba(0,0,0,0.7);
  backdrop-filter: blur(1px);
`;

const Fishing = observer(() => {
  const { fishingStore, userStore, uiStore } = useStore();
  const [resultModalOpen, setResultModalOpen] = useState(false);
  type FishingResult = { success: boolean; message?: string; fish?: { id?: string; name?: string; price?: number; image?: string } } | null;
  const [caughtFish, setCaughtFish] = useState<FishingResult>(null);
  const [loading, setLoading] = useState(false);
  const [timingOpen, setTimingOpen] = useState(false);
  const [encounterOpen, setEncounterOpen] = useState(false);
  const [encounterId, setEncounterId] = useState<string | null>(null);
  const [encounterFishName, setEncounterFishName] = useState<string>('물고기');
  const [encounterFishLevel, setEncounterFishLevel] = useState<number>(1);
  const [encounterFishId, setEncounterFishId] = useState<string | null>(null);
  const [encounterFishImage, setEncounterFishImage] = useState<string | null>(null);
  const [resultFishImage, setResultFishImage] = useState<string | null>(null);

  // Hook cinematic + bite check
  const [hooking, setHooking] = useState(false);
  const [hookPhase, setHookPhase] = useState<null | 'video' | 'result'>(null);
  const [hookSuccess, setHookSuccess] = useState<boolean | null>(null);

  const hookChance = useMemo(() => {
    // Simple heuristic: base 72% + rodLevel*3% + baitGrade*2%, clamped
    const rodLevel = userStore.user?.rodLevel ?? 1;
    const baitGrade = parseInt(fishingStore.selectedBaitId, 10) || 1;
    const raw = 0.72 + (rodLevel - 1) * 0.03 + (baitGrade - 1) * 0.02;
    return Math.min(0.94, Math.max(0.22, raw));
  }, [userStore.user?.rodLevel, fishingStore.selectedBaitId]);

  useEffect(() => {
    const id = userStore.user?.id;
    if (id) {
      fishingStore.loadInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user?.id]);

  const startFishing = async () => {
    if (loading || hooking) return;
    // 미끼 보유 검사: 선택된 미끼 수량 0이면 안내 후 종료
    const selected = fishingStore.selectedBaitId;
    const have = fishingStore.baitInventory[selected] ?? 0;
    if (have <= 0) {
      uiStore.pushNotification('error', '미끼가 없습니다. 미끼를 넣어주세요!');
      return;
    }
    // Step 1: show 3s cinematic (reuse intro video)
    setHooking(true);
    setHookPhase('video');
    setHookSuccess(null);

    // After ~3s, determine bite success/fail, show result briefly, then proceed
    window.setTimeout(async () => {
      const success = Math.random() < hookChance;
      setHookSuccess(success);
      setHookPhase('result');

      // Show result text ~1s
      window.setTimeout(async () => {
        if (!success) {
          setHooking(false);
          uiStore.pushNotification('info', '물고기를 놓쳤습니다...');
          return;
        }
                // Success: proceed to encounter as before
                const res = await fishingStore.startEncounter();
                console.log('Encounter response:', res);
        if (res?.success) {
          const fishId = res.fish?.id ?? null;
          const imagePath = res.fish?.image ?? (fishId ? FISH_IMAGES[fishId] ?? null : null);
          setEncounterId(res.encounterId);
          setEncounterFishName(res.fish?.name ?? '물고기');
          setEncounterFishLevel(res.fish?.level ?? 1);
          setEncounterFishId(fishId);
          setEncounterFishImage(imagePath);
          setEncounterOpen(true);
        } else {
          setEncounterId(null);
          setEncounterFishImage(null);
        }
        setHooking(false);
        setHookPhase(null);
      }, 1000);
    }, 3000);
  };

  const handleTimingComplete = async (score: number) => {
    setTimingOpen(false);
    setLoading(true);
    let result;
    if (encounterId) {
      result = await fishingStore.resolveEncounter(encounterId, score);
    } else {
      // fallback (구버전) directly fishing
      result = await fishingStore.doFishing(score);
    }
    setCaughtFish(result || null);
    if (result?.success) {
      const fishId = result.fish?.id ?? null;
      const imagePath = result.fish?.image ?? (fishId ? FISH_IMAGES[fishId] ?? null : null);
      setEncounterFishId(fishId);
      setResultFishImage(imagePath);
    } else {
      setEncounterFishId(null);
      setResultFishImage(encounterFishImage);
    }
    setResultModalOpen(true);
    setLoading(false);
  };

  const handleEncounterClose = () => {
    setEncounterOpen(false);
    setTimingOpen(true);
  };

  // 난이도 스케일링: 낚싯대 레벨/미끼/물고기 등 반영
  const computeTimingConfig = (
    rodLevel: number,
    baitId: string,
    fishLevel: number
  ): TimingMashConfig => {
    // 기본 파라미터 (더 어려움 쪽으로 상향)
  let durationMs = 7000; // 생존 요구 시간
  let drainPerSec = 18;  // 기본 소모 (약간 완화)
  let regenPerHit = 5;   // 기본 회복 (겹침비율 * regen)
  // 속도 분리 유지하되 전반적으로 15~25% 감속
  let targetSpeed = 250;   // 느린 패턴 (기존 300)
  let cursorSpeed = 560;   // 빠르지만 과도하지 않게 (기존 700)
  let overlapThreshold = 0.58; // 약간 완화
  let targetWidth = 86;    // 소폭 넓힘으로 체감 난도 하향
  let cursorWidth = 66;

    // 낚싯대가 높을수록 생존이 쉬워짐: 소모 감소 & 회복 증가 & 영역 약간 넓어짐
    const rodFactor = Math.max(0, rodLevel - 1); // 0 기반
    drainPerSec -= rodFactor * 1.0; // 레벨당 소모 감소
    regenPerHit += rodFactor * 0.4; // 레벨당 회복 증가
    targetWidth += rodFactor * 2.0; // 파란 영역 약간 넓어짐
    cursorWidth += rodFactor * 1.5;

    // 미끼 영향: 높은 등급 미끼는 회복 소폭 상승 + 커서 영역 약간 넓어짐
    const baitNumeric = parseInt(baitId, 10) || 1;
    regenPerHit += (baitNumeric - 1) * 0.3; // 등급당 추가 회복
    cursorWidth += (baitNumeric - 1) * 1.2;

    // 물고기 레벨이 높을수록 난이도 상승: 속도/소모 크게, 영역 크게 축소, 정확도 강화
    const fishDiff = Math.max(0, fishLevel - 1);
  drainPerSec += fishDiff * 3.0;   // 소모 증가율 약간 낮춤
  targetSpeed += fishDiff * 40;    // 레벨 보정 감속
  cursorSpeed += fishDiff * 100;   // 상위 레벨 차이는 유지하되 전체 감속
    targetWidth -= fishDiff * 10; // 상위 레벨일수록 좁음
    cursorWidth -= fishDiff * 8;
    overlapThreshold += fishDiff * 0.03; // 더 정확해야 함
    // 상위 레벨일수록 생존 시간도 살짝 짧게
    durationMs -= fishDiff * 300; // 레벨당 0.3초 감소 (최소치 보정은 아래 경계 처리)

    // 속도 차를 더 키우기 위한 약간의 무작위 편차 (매 시도마다 다르게 느껴지도록)
  const r = Math.random();
  // 감속 후 랜덤 범위도 약간 축소
  const targetScale = 0.95 + (r * 0.12);      // ~0.95~1.07
  const cursorScale = 1.02 + ((1 - r) * 0.30); // ~1.02~1.32
  targetSpeed *= targetScale;
  cursorSpeed *= cursorScale;

    // 경계값 안전 처리
  durationMs = Math.max(5000, durationMs);
  drainPerSec = Math.max(8, drainPerSec);
    regenPerHit = Math.max(2, regenPerHit);
    targetWidth = Math.max(40, targetWidth);
    cursorWidth = Math.max(35, cursorWidth);
    overlapThreshold = Math.min(0.9, overlapThreshold);

  // 무조작 승리 방지: 아무 입력도 없으면 반드시 0%에 도달하도록 최소 소모선을 강제
  // 필요한 최소 소모 = initialEnergy / (durationSec). 여기에 12% 마진을 준다.
  const durationSec = durationMs / 1000;
  const requiredMinDrain = (100 / durationSec) * 1.12;
  drainPerSec = Math.max(drainPerSec, requiredMinDrain);

  // 추가: 커서 속도가 너무 낮게 나오는 조합 방지 (최소 기준)
  cursorSpeed = Math.max(cursorSpeed, targetSpeed * 1.6); // 최소 배율도 약간 낮춤

    // 최종 반환
    const cfg: TimingMashConfig = {
      durationMs,
      drainPerSec,
      regenPerHit,
      targetSpeed,
      cursorSpeed,
      overlapThreshold,
      targetWidth,
      cursorWidth,
      hitCooldownMs: 95,
      initialEnergy: 100
    };
    return cfg;
  };

  return (
    <>
      <GameContainer style={{ backgroundImage: `url(${sea})` }}>
        <GameInner>
          <StyledTitle src={fishingTitle} alt="IT HOPE FISHING" />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(0,0,0,0.35)', color: 'white', padding: '6px 10px', borderRadius: 6 }}>
            <span>미끼 선택:</span>
            <select
              value={fishingStore.selectedBaitId}
              onChange={(e) => fishingStore.setSelectedBait(e.target.value)}
              style={{ padding: '4px 6px' }}
            >
              {Object.entries(BAITS).map(([id, bait]) => (
                <option key={id} value={id}>
                  {bait.name}
                </option>
              ))}
            </select>
            <span>보유: {fishingStore.baitInventory[fishingStore.selectedBaitId] ?? 0}개</span>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: '20px' }}>
            <Button onClick={startFishing} variant="contained" color="primary" disabled={loading || hooking}>
              {hooking ? '캐스팅...' : loading ? '낚시 중...' : '낚시하기'}
            </Button>
          </div>
        </GameInner>
      </GameContainer>

      {hooking && (
        <HookOverlay>
          <HookInner>
            {/* Pre-roll cinematic */}
            {hookPhase === 'video' && (
              <HookVideo
                src="/intro.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
              />
            )}
            {hookPhase === 'result' && (
              <HookResultText success={!!hookSuccess}>
                {hookSuccess ? '성공!' : '놓쳤다!'}
              </HookResultText>
            )}
          </HookInner>
        </HookOverlay>
      )}

      <ResultModal
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title={"낚시 결과"}
        message={(() => {
          if (!caughtFish) return '알 수 없는 결과';
          if (!caughtFish.success) return caughtFish.message || '물고기를 놓쳤습니다.';
          // New response spec uses fish object
          const fish = caughtFish.fish;
          const name = fish?.name ?? '알 수 없는 물고기';
          const price = fish?.price ?? 0;
          return `${name}을(를) 잡았습니다! (판매가 ${price}원)`;
        })()}
        imageSrc={(() => {
          if (resultFishImage) return resultFishImage;
          const id = caughtFish?.fish?.id;
          return id ? (FISH_IMAGES[id] ?? FISH_IMAGES['unknown']) : undefined;
        })()}
      />

          <TimingMashModal
            open={timingOpen}
            onClose={() => setTimingOpen(false)}
            onComplete={handleTimingComplete}
            config={computeTimingConfig(userStore.user?.rodLevel ?? 1, fishingStore.selectedBaitId, encounterFishLevel)}
          />

      <EncounterModal
        open={encounterOpen}
        fishName={encounterFishName}
        fishId={encounterFishId}
        imageSrc={encounterFishImage}
        onClose={handleEncounterClose}
      />
    </>
  );
});

export default Fishing;
