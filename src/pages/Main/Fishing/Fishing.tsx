import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import sea from '../../../assets/sea.png';
import fishingTitle from '../../../assets/IT_HOPE_FISHING.png';
import ResultModal from '../../../component/modal/ResultModal';
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
  const [caughtFish, setCaughtFish] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userStore.user.id) {
      fishingStore.loadInventory();
    }
  }, [userStore.user.id]);

  const startFishing = async () => {
    setLoading(true);
    const result = await fishingStore.doFishing();
    if (result) {
      setCaughtFish(result);
    } else {
      setCaughtFish(null);
    }
    setResultModalOpen(true);
    setLoading(false);
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
        message={
          caughtFish && caughtFish.success
            ? `${caughtFish.fish_name}을(를) 잡았습니다! (판매가 ${caughtFish.price}원)`
            : '미끼가 없거나 물고기를 놓쳤습니다...'
        }
      />
    </>
  );
});

export default Fishing;