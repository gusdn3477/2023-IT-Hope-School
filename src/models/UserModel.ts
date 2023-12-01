import { makeAutoObservable } from 'mobx';

export interface UserInterface {
  id: string;
  password: string;
  regiDate: string;
  nick: string;
  gender: string;
  farm: { id: string }[];
  money: number;
}

export class UserModel implements UserInterface {
  id: string;
  password: string;
  regiDate: string;
  nick: string;
  gender: string;
  farm: { id: string }[];
  money: number;

  constructor(user: UserInterface) {
    this.id = user.id;
    this.password = user.password;
    this.regiDate = user.regiDate;
    this.nick = user.nick;
    this.gender = user.gender;
    this.farm = user.farm;
    this.money = user.money;
  }
}
