import { useState } from 'react';
import { ItemsModal } from '../../../component/modal/Items';
import { HeaderTitleWrapper, OutletWrapper, StyledButtonWrapper, StyledHeader, InfoStrip } from './style';
import { Outlet } from 'react-router-dom';
import gameLogo from '../../../assets/logo2.png';
import { Button, Menu, MenuItem } from '@mui/material';
import coin from '../../../assets/coin.png';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/useStore';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { FishdexModal } from '../../../component/modal/Fishdex';
import SellFishModal from '../../../component/modal/SellFish';
import RodUpgradeModal from '../../../component/modal/RodUpgrade';
import BaitShopModal from '../../../component/modal/BaitShop';
import { fishingStore } from '../../../stores/FishingStore';
import { FISH_LIST, getSeasonFromDay } from '../../../constants/fish';

export const Header = observer(() => {
  const [fishdexOpen, setFishdexOpen] = useState(false);
  const [fishMenuAnchorEl, setFishMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [sellOpen, setSellOpen] = useState(false);
  const [rodOpen, setRodOpen] = useState(false);
  const [baitOpen, setBaitOpen] = useState(false);
  const { uiStore, userStore } = useStore();

  return (
    <>
      <StyledHeader>
        <div style={{ display: 'flex' }}>
          <img src={gameLogo} style={{ width: '96px', marginLeft: '6px' }} />
        </div>
        <div style={{ display: 'flex' }}>
          <HeaderTitleWrapper>
            {(() => {
              const us = userStore as unknown as { user?: { day?: number; money?: number } };
              const money = us.user?.money ?? 0;
              return (
                <>
                  <strong style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={coin} width={24} height={24} />
                    <strong>{money}원</strong>
                  </strong>
                </>
              );
            })()}
          </HeaderTitleWrapper>
          <StyledButtonWrapper>
            <Button
              variant="contained"
              onClick={(e) => setFishMenuAnchorEl(e.currentTarget)}
              style={{ fontFamily: 'Neo둥근모' }}
            >
              낚시
            </Button>
            <Button
              variant="contained"
              onClick={() => setFishdexOpen(true)}
              style={{ fontFamily: 'Neo둥근모' }}
            >
              도감 <LibraryBooksIcon style={{ width: '20px', height: '20px' }} />
            </Button>
            <Button
              variant="contained"
              onClick={() => setBaitOpen(true)}
              style={{ fontFamily: 'Neo둥근모' }}
            >
              미끼 상점{' '}
              <LocalGroceryStoreIcon style={{ width: '20px', height: '20px' }} />
            </Button>
            {/* 우측 투명 버튼 이슈 방지를 위해 '메뉴' 버튼 제거 */}
          </StyledButtonWrapper>
        </div>
      </StyledHeader>
      {(() => {
        const us = userStore as unknown as { user?: { day?: number } };
        const day = us.user?.day ?? 1;
        const season = getSeasonFromDay(day);
        const baitName = fishingStore.selectedBait.name;
        const baitCount = fishingStore.baitInventory[fishingStore.selectedBaitId] ?? 0;
        const dex = `${fishingStore.caughtFish.length}/${FISH_LIST.length}`;
        return (
          <InfoStrip>
            <span>계절: {season}</span>
            <span>|</span>
            <span>낚싯대 Lv {fishingStore.rodLevel}</span>
            <span>|</span>
            <span>미끼: {baitName} ({baitCount})</span>
            <span>|</span>
            <span>낚시터 {fishingStore.groundLevel} / 도감 {dex}</span>
          </InfoStrip>
        );
      })()}
      <Menu anchorEl={fishMenuAnchorEl} open={Boolean(fishMenuAnchorEl)} onClose={() => setFishMenuAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            // 낚시 모달로 바로 플레이: 쿼리 파라미터로 신호
            window.history.replaceState(null, '', '/main?playModal=1');
            setFishMenuAnchorEl(null);
          }}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          모달로 플레이
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSellOpen(true);
            setFishMenuAnchorEl(null);
          }}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          판매
        </MenuItem>
        <MenuItem
          onClick={() => {
            setRodOpen(true);
            setFishMenuAnchorEl(null);
          }}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          낚싯대 강화
        </MenuItem>
        <MenuItem
          onClick={() => {
            fishingStore.expand(FISH_LIST.length);
            setFishMenuAnchorEl(null);
          }}
          disabled={!fishingStore.canExpand(FISH_LIST.length)}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          낚시터 확장
        </MenuItem>
      </Menu>
      <ItemsModal
        open={uiStore.openItemModal}
        onClose={() => {
          uiStore.setOpenItemModal(false);
          uiStore.setSelectedFarmId('');
        }}
      />
      <FishdexModal open={fishdexOpen} onClose={() => setFishdexOpen(false)} />
      <SellFishModal open={sellOpen} onClose={() => setSellOpen(false)} />
      <RodUpgradeModal open={rodOpen} onClose={() => setRodOpen(false)} />
      <BaitShopModal open={baitOpen} onClose={() => setBaitOpen(false)} />
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </>
  );
});
