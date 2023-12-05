import { makeAutoObservable } from 'mobx';
import { userRepository } from '../repository/UserRepository';
class UserStore {
  isLogin = false;
  id = '';
  bag = {};
  farm = {};
  gender = '';
  day = 0;
  money = 0;
  nick = '';

  constructor() {
    makeAutoObservable(this);
  }

  async signup({ id, password, regiDate, nick, gender }) {
    try {
      const res = await userRepository.signUp({
        id,
        password,
        regiDate,
        nick,
        gender,
      });
      return res.data.success ?? false;
    } catch (e) {
      console.log(e);
    }
  }
  async login({ id, password }) {
    try {
      const res = await userRepository.login({ id, password });
      if (res.data.success) {
        this.id = res.data.id;
        this.bag = res.data.bag;
        this.farm = res.data.farm;
        this.gender = res.data.gender;
        this.day = res.data.day;
        this.money = res.data.money;
        this.nick = res.data.nick;
      }
      return res.data.success ?? false;
    } catch (e) {
      console.log(e);
    }
  }

  logout() {
    this.isLogin = false;
  }
}

export const userStore = new UserStore();
