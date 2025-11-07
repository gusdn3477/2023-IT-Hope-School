import { useState, useEffect } from 'react';
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
import { GameContainer, GameInner } from './style';

const StyledTitle = styled.img`
  width: 400px;
  margin-bottom: 20px;
`;

const Fishing = observer(() => {
  const { fishingStore, userStore } = useStore();
  const [resultModalOpen, setResultModalOpen] = useState(false);
  type FishingResult = { success: boolean; message?: string; fish?: { name?: string; price?: number } } | null;
  const [caughtFish, setCaughtFish] = useState<FishingResult>(null);
  const [loading, setLoading] = useState(false);
  const [timingOpen, setTimingOpen] = useState(false);
  const [encounterOpen, setEncounterOpen] = useState(false);
  const [encounterId, setEncounterId] = useState<string | null>(null);
  const [encounterFishName, setEncounterFishName] = useState<string>('물고기');
  const [encounterFishLevel, setEncounterFishLevel] = useState<number>(1);

  useEffect(() => {
    const id = userStore.user?.id;
    if (id) {
      fishingStore.loadInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user?.id]);

  const startFishing = async () => {
    // 서버에 조우 요청 -> 물고기 미리 공개
    const res = await fishingStore.startEncounter();
    if (res?.success) {
      setEncounterId(res.encounterId);
      setEncounterFishName(res.fish?.name ?? '물고기');
      setEncounterFishLevel(res.fish?.level ?? 1);
      setEncounterOpen(true);
    }
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
  let drainPerSec = 19;  // 기본 소모 (약간 증가)
  let regenPerHit = 5;   // 기본 회복 (겹침비율 * regen)
  // 속도 분리: 파란(타겟)은 느리고 안정적, 노란(커서)은 빠르고 더 큰 폭으로 튐
  let targetSpeed = 300;   // 이전보다 낮춰 조준 감
  let cursorSpeed = 700;   // 커서 속도 크게 증가
  let overlapThreshold = 0.59;
  let targetWidth = 84;
  let cursorWidth = 64;

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
  drainPerSec += fishDiff * 3.2;
  targetSpeed += fishDiff * 50;   // 상위 레벨에서도 느림 유지
  cursorSpeed += fishDiff * 120;  // 상위 레벨일수록 훨씬 더 빨라짐
    targetWidth -= fishDiff * 10; // 상위 레벨일수록 좁음
    cursorWidth -= fishDiff * 8;
    overlapThreshold += fishDiff * 0.03; // 더 정확해야 함
    // 상위 레벨일수록 생존 시간도 살짝 짧게
    durationMs -= fishDiff * 300; // 레벨당 0.3초 감소 (최소치 보정은 아래 경계 처리)

    // 속도 차를 더 키우기 위한 약간의 무작위 편차 (매 시도마다 다르게 느껴지도록)
  const r = Math.random();
  // 서로 다른 랜덤 분포 적용: 타겟은 미세 변동, 커서는 큰 변동
  const targetScale = 0.92 + (r * 0.18);    // ~0.92~1.10 (미세)
  const cursorScale = 1.05 + ((1 - r) * 0.45); // ~1.05~1.50 (크게)
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
  cursorSpeed = Math.max(cursorSpeed, targetSpeed * 1.75);

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
            <Button onClick={startFishing} variant="contained" color="primary" disabled={loading}>
              {loading ? '낚시 중...' : '낚시하기'}
            </Button>
          </div>
        </GameInner>
      </GameContainer>

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
        onClose={handleEncounterClose}
      />
    </>
  );
});

export default Fishing;