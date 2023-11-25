import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ground from '../../../assets/ground.png';

const StyledFarmGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 1250px;
`;

const StyledGridItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 160px;
  background-image: url(${ground});
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
            <div>
              셀 {i + 1}-{j + 1}
            </div>
            <div>
              셀 {i + 1}-{j + 1}
            </div>
            <div>
              셀 {i + 1}-{j + 1}
            </div>
            <div>
              셀 {i + 1}-{j + 1}
            </div>
          </StyledGridItem>,
        );
      }
    }
    setGridItems(items);
  };

  return <StyledFarmGrid>{gridItems}</StyledFarmGrid>;
};

export default Farms;
