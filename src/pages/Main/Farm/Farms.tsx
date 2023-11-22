import React from 'react';
import { FarmsWrapper } from './style';
import { TopFarmsWrapper } from './Top/style';
import { BottomFarmsWrapper } from './Bottom/style';
import Farm from './Farm';

const Farms = () => {
  return (
    <FarmsWrapper>
      <Farm />
    </FarmsWrapper>
  );
};

export default Farms;
