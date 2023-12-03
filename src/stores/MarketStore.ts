import { makeAutoObservable } from 'mobx';
import { farmRepository } from '../repository/FarmRepository';

class MarketStore {
  marketItem = {};

  constructor() {
    makeAutoObservable(this);
  }
}

export const marketStore = new MarketStore();
