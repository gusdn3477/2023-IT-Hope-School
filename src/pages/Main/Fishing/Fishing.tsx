import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { Dialog } from '@mui/material';
import sea from '../../../assets/sea.png';
import fishingTitle from '../../../assets/IT_HOPE_FISHING.png';
import ResultModal from '../../../component/modal/ResultModal';
import { useStore } from '../../../hooks/useStore';
import { observer } from 'mobx-react-lite';
import { fishingStore } from '../../../stores/FishingStore';
import { FISH_LIST, getSeasonFromDay, Season, Fish } from '../../../constants/fish';
import EncounterModal from '../../../component/modal/Encounter';
import { BAITS } from '../../../constants/bait';
import {
  GameContainer,
  GameInner,
  BiteIndicator,
  FightBarContainer,
  SuccessZone,
  Marker,
  FightProgressContainer,
  FightProgressBar,
} from './style';

const StyledTitle = styled.img`
  width: 400px;
  margin-bottom: 20px;
`;

const ModalContainer = styled(Dialog)`
  & .MuiDialog-paper {
    width: min(900px, 95vw);
    height: min(650px, 85vh);
    max-width: 95vw;
    overflow: hidden;
    background: #0b1e3a;
  }
`;

type GameState = 'idle' | 'waiting' | 'hooking' | 'fighting' | 'caught' | 'failed';

// Derived performance values
const getRodSpec = () => 5 + fishingStore.rodLevel * 2; // Higher is better
const getBaitSpec = () => fishingStore.selectedBait.effect; // Higher is better

const Fishing = observer(() => {
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [money, setMoney] = useState(0);
  const [caughtName, setCaughtName] = useState<string | null>(null);
  const [encounterOpen, setEncounterOpen] = useState(false);
  const [encounterFish, setEncounterFish] = useState<Fish | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reelTicks, setReelTicks] = useState(0); // recent reel input frames
  // 낚시 메뉴는 헤더에서만 노출됩니다.
  const { userStore } = useStore();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [fishLevel, setFishLevel] = useState(0);
  const [fightProgress, setFightProgress] = useState(50);
  const [markerPosition, setMarkerPosition] = useState(145); // 0-290 for 300px container - 10px marker
  const [successZonePosition, setSuccessZonePosition] = useState(125); // 0-250 for 300px container - 50px zone
  const [successZoneDirection, setSuccessZoneDirection] = useState(1);
  const rodSpec = getRodSpec();
  const baitSpec = getBaitSpec();
  // Balance pass: slightly harder early game, still scales with gear
  const successZoneWidth = Math.min(240, 40 + (rodSpec + baitSpec) * 2.2);
  const markerSpeed = Math.max(1, 2 + fishLevel * 0.35 - 0.02 * (rodSpec + baitSpec));
  const successZoneSpeed = Math.max(1, 4 + fishLevel * 0.15 - 0.01 * (rodSpec + baitSpec));

  const resetGame = useCallback(() => {
    setGameState('idle');
    setFightProgress(50);
    setFishLevel(0);
    setMarkerPosition(145);
    setSuccessZonePosition(125);
    setSuccessZoneDirection(1);
  }, []);

  const handleCatch = useCallback(() => {
    // Use the encountered fish if set, else pick based on fishLevel
    let target: Fish | null = encounterFish;
    if (!target) {
      const us = userStore as unknown as { user?: { day?: number } };
      const day = us.user?.day ?? 1;
      const season: Season = getSeasonFromDay(day);
      const pool = FISH_LIST.filter(
        (f) => f.ground <= fishingStore.groundLevel && f.seasons.includes(season)
      );
      target = pool.sort((a, b) => Math.abs(a.level - fishLevel) - Math.abs(b.level - fishLevel))[0] || FISH_LIST[0];
    }
    fishingStore.catchFish(target);
    setCaughtName(target.name);
    setMoney(target.price);
    setResultModalOpen(true);
    resetGame();
  }, [fishLevel, resetGame, userStore, encounterFish]);

  const handleFailure = useCallback(() => {
    setMoney(0);
    setResultModalOpen(true);
    resetGame();
  }, [resetGame]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return;
      e.preventDefault();

      if (gameState === 'hooking') {
        // Instant catch chance based on gear advantage
        const gear = rodSpec + baitSpec;
        const luck = Math.max(0, (gear - fishLevel * 2) * 0.02);
        const luckClamped = Math.min(0.25, luck); // cap at 25%
        if (Math.random() < luckClamped) {
          setGameState('caught');
          return;
        }
        // Start fight with a small head start based on gear
        const baseProgress = Math.min(60, 35 + Math.floor(Math.min(15, gear * 0.5)));
        setFightProgress(baseProgress);
        setGameState('fighting');
      } else if (gameState === 'fighting') {
        setMarkerPosition(p => Math.max(0, p - Math.ceil((rodSpec + baitSpec) * 1.2))); // stronger pull with gear
        setReelTicks((t) => Math.min(t + 2, 6));
      }
    },
  [gameState, rodSpec, baitSpec, fishLevel]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    let gameLoop: number;

    if (gameState === 'waiting') {
      const waitTime = Math.random() * 4000 + 2000; // 2-6 seconds
      gameLoop = window.setTimeout(() => {
        const level = Math.floor(Math.random() * 10) + 1; // Random fish level 1-10
        setFishLevel(level);
        // Pre-select encounter fish based on level/season/ground
        const us = userStore as unknown as { user?: { day?: number } };
        const day = us.user?.day ?? 1;
        const season: Season = getSeasonFromDay(day);
        const pool = FISH_LIST.filter(
          (f) => f.ground <= fishingStore.groundLevel && f.seasons.includes(season)
        );
        const target = pool.sort((a, b) => Math.abs(a.level - level) - Math.abs(b.level - level))[0] || FISH_LIST[0];
        setEncounterFish(target);
        setEncounterOpen(true);
        setGameState('hooking');
      }, waitTime);
    } else if (gameState === 'hooking') {
      const gear = rodSpec + baitSpec;
      const hookTime = Math.min(4500, 3000 + gear * 50); // longer reaction window with better gear
      gameLoop = window.setTimeout(() => {
        setGameState('failed');
      }, hookTime);
    } else if (gameState === 'fighting') {
      gameLoop = window.setInterval(() => {
        // Compute next positions synchronously to avoid stale state in checks
        let nextZonePos = successZonePosition + successZoneSpeed * successZoneDirection;
        let nextZoneDir = successZoneDirection;
        const maxZonePos = 300 - successZoneWidth;
        if (nextZonePos > maxZonePos) {
          nextZonePos = maxZonePos;
          nextZoneDir = -1;
        }
        if (nextZonePos < 0) {
          nextZonePos = 0;
          nextZoneDir = 1;
        }

  const nextMarkerPos = Math.min(300 - 10, markerPosition + markerSpeed);

        // Evaluate success against the computed next positions
        const inZone =
          nextMarkerPos >= nextZonePos &&
          nextMarkerPos <= nextZonePos + successZoneWidth - 10;

        // Only gain when actively reeling AND in the zone
        if (inZone && reelTicks > 0) {
          const gain = 1.4 + 0.10 * (rodSpec + baitSpec);
          setFightProgress((p) => Math.min(100, p + gain));
        } else {
          // Softer decay: target ~5-8 per second in early game
          const base = 0.35; // per 50ms tick
          const calc = base + fishLevel * 0.03 - 0.03 * (rodSpec + baitSpec);
          const decay = Math.max(0.15, calc);
          setFightProgress((p) => Math.max(0, p - decay));
        }

        // Decay reel input over time
        setReelTicks((t) => Math.max(0, t - 1));

        // Commit updates
        setSuccessZonePosition(nextZonePos);
        setSuccessZoneDirection(nextZoneDir);
        setMarkerPosition(nextMarkerPos);
      }, 50);
    }

    return () => {
      clearTimeout(gameLoop);
      clearInterval(gameLoop);
    };
  }, [
    gameState,
    fishLevel,
    successZoneDirection,
    successZoneWidth,
    markerSpeed,
    successZoneSpeed,
    markerPosition,
    successZonePosition,
    rodSpec,
    baitSpec,
    reelTicks,
    userStore,
  ]);

  useEffect(() => {
    if (fightProgress >= 100) {
      setGameState('caught');
    } else if (fightProgress <= 0) {
      setGameState('failed');
    }
  }, [fightProgress]);

  useEffect(() => {
    if (gameState === 'caught') {
      handleCatch();
    } else if (gameState === 'failed') {
      handleFailure();
    }
  }, [gameState, handleCatch, handleFailure]);

  const startFishing = () => {
    // consume bait
    const ok = fishingStore.useBait(fishingStore.selectedBaitId);
    if (!ok) {
      setCaughtName(null);
      setMoney(0);
      setResultModalOpen(true);
      return;
    }
    setGameState('waiting');
  };

  const getEncounterImage = (fish: Fish | null) => {
    if (!fish) return undefined;
    // The user can place images in public/fish/{id}.png
    return `/fish/${fish.id}.png`;
  };

  return (
    <>
      {/* Reusable game view */}
      {(() => {
        const buildGameView = (withBg: boolean) => (
          <GameContainer style={withBg ? { backgroundImage: `url(${sea})` } : undefined}>
            <GameInner>
              <StyledTitle src={fishingTitle} alt="IT HOPE FISHING" />
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(0,0,0,0.35)', color: 'white', padding: '6px 10px', borderRadius: 6 }}>
              <span>미끼 선택:</span>
              <select
                value={fishingStore.selectedBaitId}
                onChange={(e) => fishingStore.setSelectedBait(e.target.value)}
                style={{ padding: '4px 6px' }}
              >
                {BAITS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (+{b.effect})
                  </option>
                ))}
              </select>
              <span>보유: {fishingStore.baitInventory[fishingStore.selectedBaitId] ?? 0}개</span>
              {fishLevel > 0 && <span>난이도: {fishLevel}</span>}
              </div>

            {gameState === 'idle' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={startFishing} variant="contained" color="primary">
                  낚시하기
                </Button>
              </div>
            )}

            {gameState === 'waiting' && <div>...기다리는 중...</div>}

            {gameState === 'hooking' && <BiteIndicator>!</BiteIndicator>}

            {gameState === 'fighting' && (
              <>
                <FightBarContainer>
                  <SuccessZone position={successZonePosition} width={successZoneWidth} />
                  <Marker position={markerPosition} />
                </FightBarContainer>
                <FightProgressContainer>
                  <FightProgressBar progress={fightProgress} />
                </FightProgressContainer>
                <div>Spacebar를 연타해서 노란색을 초록색 영역에 맞추세요!</div>
              </>
            )}
            </GameInner>
          </GameContainer>
        );

        return (
          <>
            {/* Inline play */}
            {!modalOpen && (
              <>
                {buildGameView(false)}
                <div style={{ marginTop: 8 }}>
                  <Button variant="outlined" onClick={() => setModalOpen(true)}>
                    모달로 플레이
                  </Button>
                </div>
              </>
            )}
            {/* Modal play */}
            <ModalContainer open={modalOpen} onClose={() => { setModalOpen(false); }} disableScrollLock>
              {buildGameView(true)}
            </ModalContainer>
          </>
        );
      })()}
      <ResultModal
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title={"낚시 결과"}
        message={
          caughtName
            ? `${caughtName}을(를) 잡았습니다! (판매가 ${money}원)`
            : '미끼가 없거나 물고기를 놓쳤습니다...'
        }
      />
      <EncounterModal
        open={encounterOpen && gameState === 'hooking'}
        onClose={() => setEncounterOpen(false)}
        fishName={encounterFish?.name || ''}
        imageSrc={getEncounterImage(encounterFish)}
      />
    </>
  );
});

export default Fishing;