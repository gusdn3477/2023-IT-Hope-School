import { makeAutoObservable } from 'mobx';
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
      userStore.user = res.data;
      return res.data.farm;
    } catch (e) {
      console.log(e);
    }
  }
}

export const farmStore = new FarmStore();
