import { makeAutoObservable, runInAction } from 'mobx';
import { userRepository } from '../repository/UserRepository';
import { fishingRepository } from '../repository/FishingRepository';
import { uiStore } from './UIStore';

interface UserData {
  id: string;
  nickname?: string;
  money?: number;
  level?: number;
  rodLevel?: number;
  unlockedSites?: number[];
  baitInventory?: Record<string, number>;
}

class UserStore {
  isLogin = false;
  user: UserData | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async signup({ id, password, nick }: {id: string, password: string, nick: string}) {
    try {
      const res = await userRepository.signUp({ id, password, nick });
      if (res.data.success) {
        uiStore.pushNotification('success', '회원가입 성공');
      } else {
        uiStore.pushNotification('error', res.data.message || '회원가입 실패');
      }
      return res.data.success ?? false;
    } catch (e) {
      console.log(e);
      uiStore.pushNotification('error', '회원가입 오류');
    }
  }

  async login({ id, password }: {id: string, password: string}) {
    try {
      const res = await userRepository.login({ id, password });
      if (res.data.success) {
        runInAction(() => {
          this.isLogin = true;
          const base: UserData = {
            id: res.data.playerId,
            nickname: res.data.data.nickname,
            money: res.data.data.money,
            level: res.data.data.level,
            rodLevel: res.data.data.rodLevel,
            unlockedSites: res.data.data.unlockedSites,
            baitInventory: res.data.data.baitInventory,
          };
          this.user = base;
        });
        await this.refreshUserState();
        uiStore.pushNotification('success', '로그인 성공');
      } else {
        uiStore.pushNotification('error', res.data.message || '로그인 실패');
      }
      return res.data.success ?? false;
    } catch (e) {
      console.log(e);
      uiStore.pushNotification('error', '로그인 예외 발생');
    }
  }

  async loadUser() {
    try {
      if (!this.user) return;
      const res = await userRepository.getUser(this.user.id);
      if (res.data.success) {
        runInAction(() => {
          if (!this.user) return;
          this.user.nickname = res.data.data.nickname;
          this.user.money = res.data.data.money;
          this.user.level = res.data.data.level;
          this.user.rodLevel = res.data.data.rodLevel;
          this.user.unlockedSites = res.data.data.unlockedSites;
          this.user.baitInventory = res.data.data.baitInventory;
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async refreshUserState() {
    await this.loadUser();
    if (this.user) {
      const inv = await fishingRepository.getInventory(this.user.id);
      if (inv.data.success) {
        runInAction(() => {
          if (this.user) {
            this.user.money = inv.data.inventory.money;
            this.user.rodLevel = inv.data.inventory.rodLevel;
            this.user.baitInventory = inv.data.inventory.baitInventory;
            this.user.unlockedSites = inv.data.inventory.unlockedSites;
          }
        });
      }
      // 도감은 FishingStore에서 관리 (필요 시 외부에서 fishingStore.getEncyclopedia 호출)
    }
  }

  logout() {
    this.isLogin = false;
  this.user = null;
    uiStore.pushNotification('info', '로그아웃 되었습니다');
  }
}

export const userStore = new UserStore();
