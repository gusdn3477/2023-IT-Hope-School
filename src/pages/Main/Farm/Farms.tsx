import { useEffect, useState } from 'react';

import styled, { css } from 'styled-components';
import { Menu, MenuItem } from '@mui/material';

import ground from '../../../assets/ground.png';
import { useStore } from '../../../hooks/useStore';

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

const Farms = () => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [gridItems, setGridItems] = useState<JSX.Element[]>([]);
  const [selectedItem, setSelectedItem] = useState('');

  const { uiStore } = useStore();

  const handleClickItem = (
    event: React.MouseEvent<HTMLElement>,
    item: string,
    farmId: number,
  ) => {
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
    setSelectedItem(item);
    uiStore.setSelectedFarmId(farmId);
    console.log(item);
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handleClickPlant = () => {
    console.log('handleClickPlant', selectedItem, import.meta.env.VITE_APP_URL);
    uiStore.setOpenItemModal(true);
    handleCloseMenu();
  };

  const handleClickHarvest = () => {
    console.log('handleClickHarvest', selectedItem);
    handleCloseMenu();
  };

  useEffect(() => {
    initializeGridItems();
  }, []);

  const initializeGridItems = () => {
    const items = [];
    const count = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        items.push(
          <StyledGridItem
            key={`${i}-${j}`}
            onClick={(e) => handleClickItem(e, `${i}-${j}`, i * 4 + j)}
            $tile={ground}
          ></StyledGridItem>,
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
        <MenuItem
          onClick={handleClickPlant}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          {'심기'}
        </MenuItem>
        <MenuItem
          onClick={handleClickHarvest}
          style={{ fontFamily: 'Neo둥근모' }}
        >
          {'수확하기'}
        </MenuItem>
      </Menu>
    </>
  );
};

export default Farms;
