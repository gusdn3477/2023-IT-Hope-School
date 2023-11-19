import { makeAutoObservable } from 'mobx';

class UserStore {
  isLogin = false;

  constructor() {
    makeAutoObservable(this);
  }

  login() {
    this.isLogin = true;
  }

  logout() {
    this.isLogin = false;
  }
}

export const userStore = new UserStore();
