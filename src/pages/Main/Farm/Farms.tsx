import styled from 'styled-components';
import { useEffect, useState } from 'react';

const StyledFarmGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 800px;
`;

const StyledGridItem = styled.div`
  display: flex;
  margin: 5px;
  padding: 20px;
  width: 320px;
  height: 120px;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const Farms = () => {
  const [gridItems, setGridItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    initializeGridItems();
  }, []);

  const initializeGridItems = () => {
    const items = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        items.push(
          <StyledGridItem key={`${i}-${j}`}>
            셀 {i + 1}-{j + 1}
          </StyledGridItem>,
        );
      }
    }
    setGridItems(items);
  };

  return <StyledFarmGrid>{gridItems}</StyledFarmGrid>;
};

export default Farms;
