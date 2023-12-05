import { makeAutoObservable } from 'mobx';
import { marketRepository } from '../repository/MarketRepository';
import { userStore } from './UserStore';

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

  async buy({ id, itemId }: { id: string; itemId: string }) {
    try {
      const res = await marketRepository.buy({ id, itemId });
      userStore.user = res.data;
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }
}

export const marketStore = new MarketStore();
