import { makeAutoObservable } from 'mobx';
import { farmRepository } from '../repository/FarmRepository';
class FarmStore {
  farm = {};

  constructor() {
    makeAutoObservable(this);
  }

  async sleep({ id }) {
    try {
      const res = await farmRepository.sleep({ id });
      return res.data.farm;
    } catch (e) {
      console.log(e);
    }
  }
}

export const farmStore = new FarmStore();
