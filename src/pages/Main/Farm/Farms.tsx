import { useEffect, useState } from 'react';

import styled, { css } from 'styled-components';
import { Menu, MenuItem } from '@mui/material';

import vine from '../../../assets/vine.png';
import seed from '../../../assets/seed.png';
import ground from '../../../assets/ground.png';
import { useStore } from '../../../hooks/useStore';
import { items as marketItems } from '../../../constants/items';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { farmStore } from '../../../stores/FarmStore';
import HarvestModal from '../../../component/modal/Harvest';

const StyledFarmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const StyledGridItem = styled.div<{ $tile?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 160px;
  border: 0.5px solid #d6b469;
  box-sizing: border-box;
  ${({ $tile }) =>
    $tile &&
    css`
      background-image: url(${$tile});
    `}
`;

const Farms = observer(() => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [gridItems, setGridItems] = useState<JSX.Element[]>([]);
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [money, setMoney] = useState(0);

  const { userStore, uiStore } = useStore();

  const handleClickItem = (
    event: React.MouseEvent<HTMLElement>,
    farmId: string,
  ) => {
    const id = `${farmId}`;
    const targetTileInfo = userStore.user?.farm[id];

    if (targetTileInfo)
      setContextMenu({
        mouseX: event.clientX + 2,
        mouseY: event.clientY - 6,
      });
    uiStore.setSelectedFarmId(farmId);
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handleClickPlant = () => {
    // console.log('handleClickPlant', import.meta.env.VITE_APP_URL);
    uiStore.setOpenItemModal(true);
    handleCloseMenu();
  };

  const handleClickHarvest = async () => {
    const targetTileInfo = userStore.user?.farm[uiStore.selectedFarmId].item;
    let count = 0;
    let money = 0;
    if (targetTileInfo.itemId === '0') {
      count = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < count; i++) {
        money += Math.floor(Math.random() * 6) + 15;
      }
    } else if (targetTileInfo.itemId === '1') {
      count = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < count; i++) {
        money += Math.floor(Math.random() * 6) + 15;
      }
    } else if (targetTileInfo.itemId === '2') {
      count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        money += Math.floor(Math.random() * 16) + 45;
      }
    } else if (targetTileInfo.itemId === '3') {
      count = 3;
      for (let i = 0; i < count; i++) {
        money += Math.floor(Math.random() * 201) + 300;
      }
    } else {
      count = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < count; i++) {
        money += Math.floor(Math.random() * 51) + 150;
      }
    }

    const res = await farmStore.harvest({
      id: userStore.user.id,
      farmId: uiStore.selectedFarmId,
      money,
    });

    if (res) {
      setMoney(money);
      setHarvestModalOpen(true);
    }
    handleCloseMenu();
  };

  useEffect(() => {
    initializeGridItems();
  }, [userStore.user]);

  const initializeGridItems = () => {
    const items = [];
    const count = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let tile = '';
        const targetTileInfo = userStore.user?.farm[`${i * 4 + j}`].item;
        if (targetTileInfo?.complete) {
          tile = marketItems[targetTileInfo.itemId].grownImgSrc;
        } else if (targetTileInfo?.day === 0) {
          tile = seed;
        } else if (targetTileInfo) {
          tile = vine;
        }
        items.push(
          <div
            onClick={(e) => handleClickItem(e, `${i * 4 + j}`)}
            key={`${i * 4 + j}`}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <StyledGridItem $tile={ground}></StyledGridItem>
            {tile !== '' && (
              <img
                src={tile}
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: '40px',
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                }}
              />
            )}
          </div>,
        );
      }
    }
    setGridItems(items);
  };

  return (
    <>
      <StyledFarmGrid>{gridItems}</StyledFarmGrid>
      <HarvestModal
        open={harvestModalOpen}
        onClose={() => setHarvestModalOpen(false)}
        money={money}
      />
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {userStore.user?.farm[uiStore.selectedFarmId]?.item === undefined && (
          <MenuItem
            onClick={handleClickPlant}
            style={{ fontFamily: 'Neo둥근모' }}
          >
            {'심기'}
          </MenuItem>
        )}
        {userStore.user?.farm[uiStore.selectedFarmId]?.item?.complete ===
          true && (
          <MenuItem
            onClick={handleClickHarvest}
            style={{ fontFamily: 'Neo둥근모' }}
          >
            {'수확하기'}
          </MenuItem>
        )}
        {userStore.user?.farm[uiStore.selectedFarmId]?.item?.complete ===
          false && (
          <MenuItem disabled style={{ fontFamily: 'Neo둥근모' }}>
            {'성장 중'}
          </MenuItem>
        )}
      </Menu>
    </>
  );
});

export default Farms;
