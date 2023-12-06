import { makeAutoObservable, toJS } from 'mobx';
import { farmRepository } from '../repository/FarmRepository';
import { userStore } from './UserStore';
class FarmStore {
  farm = {};

  constructor() {
    makeAutoObservable(this);
  }

  async sleep({ id }) {
    try {
      const res = await farmRepository.sleep({ id });
      userStore.user = toJS(res.data);
      return res.data.farm;
    } catch (e) {
      console.log(e);
    }
  }

  async plant({
    id,
    farmId,
    itemId,
  }: {
    id: string;
    farmId: string;
    itemId: string;
  }) {
    try {
      const res = await farmRepository.plant({ id, farmId, itemId });
      userStore.user = toJS(res.data);
      return res.data.farm;
    } catch (e) {
      console.log(e);
    }
  }

  async harvest({
    id,
    farmId,
    money,
  }: {
    id: string;
    farmId: string;
    money: number;
  }) {
    try {
      const res = await farmRepository.harvest({ id, farmId, money });
      userStore.user = toJS(res.data);
      return res.data.farm;
    } catch (e) {
      console.log(e);
    }
  }
}

export const farmStore = new FarmStore();
