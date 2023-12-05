import { makeAutoObservable, toJS } from 'mobx';
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

  async buy(dto: { id: string; items: { itemId: string; count: number }[] }) {
    try {
      const res = await marketRepository.buy(dto);
      if (res.data.success) {
        userStore.user = toJS(res.data);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }
}

export const marketStore = new MarketStore();
