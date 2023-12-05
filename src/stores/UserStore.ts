import { makeAutoObservable, toJS } from 'mobx';
import { userRepository } from '../repository/UserRepository';
class UserStore {
  isLogin = false;
  user = {};
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
        this.user = toJS(res.data);
        this.id = res.data.id;
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
