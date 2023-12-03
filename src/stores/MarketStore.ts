import { makeAutoObservable } from 'mobx';
import { marketRepository } from '../repository/MarketRepository';

class MarketStore {
  marketItem = {};

  constructor() {
    makeAutoObservable(this);
  }

  async get() {
    try {
      const res = await marketRepository.get();
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }
}

export const marketStore = new MarketStore();
