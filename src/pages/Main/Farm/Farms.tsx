import { useEffect, useState } from 'react';

import styled, { css } from 'styled-components';
import { Menu, MenuItem } from '@mui/material';

import vine from '../../../assets/vine.png';
import seed from '../../../assets/seed.png';
import ground from '../../../assets/ground.png';
import { useStore } from '../../../hooks/useStore';
import { items as marketItems } from '../../../constants/items';
import { observer } from 'mobx-react-lite';

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
  cursor: pointer;
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

  const { userStore, uiStore } = useStore();

  const handleClickItem = (
    event: React.MouseEvent<HTMLElement>,
    farmId: string,
  ) => {
    const id = `${farmId}`;
    const targetTileInfo = userStore.user?.farm[id];

    if (targetTileInfo)
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null,
      );
    uiStore.setSelectedFarmId(farmId);
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handleClickPlant = () => {
    console.log('handleClickPlant', import.meta.env.VITE_APP_URL);
    uiStore.setOpenItemModal(true);
    handleCloseMenu();
  };

  const handleClickHarvest = () => {
    console.log('handleClickHarvest');
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
          <div key={`${i * 4 + j}`} style={{ position: 'relative' }}>
            <StyledGridItem
              onClick={(e) => handleClickItem(e, `${i * 4 + j}`)}
              $tile={ground}
            ></StyledGridItem>
            {tile !== '' && (
              <img
                src={tile}
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '160px',
                  height: '160px',
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
        {userStore.user?.farm?.farmId?.item === undefined && (
          <MenuItem
            onClick={handleClickPlant}
            style={{ fontFamily: 'Neo둥근모' }}
          >
            {'심기'}
          </MenuItem>
        )}
        {userStore.user?.farm?.farmId?.item?.complete === true && (
          <MenuItem
            onClick={handleClickHarvest}
            style={{ fontFamily: 'Neo둥근모' }}
          >
            {'수확하기'}
          </MenuItem>
        )}
      </Menu>
    </>
  );
});

export default Farms;
