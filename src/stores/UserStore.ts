import { makeAutoObservable } from 'mobx';
import { userRepository } from '../repository/UserRepository';
class UserStore {
  isLogin = false;

  constructor() {
    makeAutoObservable(this);
  }

  async signup({ id, password, regiDate, nick, gender }) {
    const res = await userRepository.signUp({
      id,
      password,
      regiDate,
      nick,
      gender,
    });
    return res;
  }
  async login({ id, password }) {
    const res = await userRepository.login({ id, password });
    if (res) this.isLogin = true;
  }

  logout() {
    this.isLogin = false;
  }
}

export const userStore = new UserStore();
