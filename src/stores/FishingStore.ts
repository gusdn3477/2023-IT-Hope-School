import { makeAutoObservable, runInAction } from 'mobx';
import { fishingRepository } from '../repository/FishingRepository';
import { userStore } from './UserStore';
import { uiStore } from './UIStore';

export interface FishDexEntry {
  id: string;
  name: string;
  level: number;
  price: number;
  rate: number;
  caught: boolean;
}

class FishingStore {
  rodLevel = 1;
  groundLevel = 1; // unlocked fishing area tier
  selectedBaitId: string = '1';
  baitInventory: Record<string, number> = {};
  fishBag: Record<string, number> = {}; // fishId -> count
  caughtFish: FishDexEntry[] = []; // fish dex

  constructor() {
    makeAutoObservable(this);
  }

  async loadInventory() {
    try {
      const id = userStore.user?.id;
      if (!id) return;
      const res = await fishingRepository.getInventory(id);
      if (res.data.success) {
        runInAction(() => {
          this.rodLevel = res.data.inventory.rodLevel;
          this.baitInventory = res.data.inventory.baitInventory;
          const fishBag: Record<string, number> = {};
          for (const fish of res.data.inventory.caughtFish as Array<{ fishId: number; count: number }>) {
            fishBag[String(fish.fishId)] = fish.count;
          }
          this.fishBag = fishBag;
          const sites = res.data.inventory.unlockedSites as number[] | undefined;
          this.groundLevel = Array.isArray(sites) ? sites.length : 1;
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  setSelectedBait(id: string) {
    this.selectedBaitId = id;
  }

  async doFishing() {
    try {
      const id = userStore.user?.id;
      if (!id) return;
      const res = await fishingRepository.doFishing(id, this.selectedBaitId);
      await this.loadInventory();
      if (res.data.success) uiStore.pushNotification('success', res.data.message);
      else uiStore.pushNotification('error', res.data.message);
      return res.data;
    } catch (e) {
      console.error(e);
      uiStore.pushNotification('error', '낚시 중 오류');
    }
  }

  async sellFish(fishId: string, quantity: number) {
    try {
      const id = userStore.user?.id;
      if (!id) return;
      const res = await fishingRepository.sellFish(id, fishId, quantity);
      await userStore.loadUser();
      await this.loadInventory();
      uiStore.pushNotification(res.data.success ? 'success' : 'error', res.data.message);
      return res.data;
    } catch (e) {
      console.error(e);
      uiStore.pushNotification('error', '판매 중 오류');
    }
  }

  async buyBait(baitId: string, quantity: number) {
    try {
      const id = userStore.user?.id;
      if (!id) return;
      const res = await fishingRepository.buyBait(id, baitId, quantity);
      await userStore.loadUser();
      await this.loadInventory();
      uiStore.pushNotification(res.data.success ? 'success' : 'error', res.data.message);
      return res.data;
    } catch (e) {
      console.error(e);
      uiStore.pushNotification('error', '미끼 구매 오류');
    }
  }

  async upgradeRod() {
    try {
      const id = userStore.user?.id;
      if (!id) return;
      const res = await fishingRepository.upgradeRod(id);
      await userStore.loadUser();
      await this.loadInventory();
      uiStore.pushNotification(res.data.success ? 'success' : 'error', res.data.message);
      return res.data;
    } catch (e) {
      console.error(e);
      uiStore.pushNotification('error', '강화 오류');
    }
  }

  async getEncyclopedia() {
    try {
      const id = userStore.user?.id;
      if (!id) return;
      const res = await fishingRepository.getEncyclopedia(id);
      if (res.data?.success) {
        runInAction(() => {
          // 백엔드 구조: { success: true, fish_data: [...] }
          this.caughtFish = res.data.fish_data ?? [];
        });
      } else {
        console.warn("Failed to load encyclopedia", res.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async unlock() {
    try {
      const id = userStore.user?.id;
      if (!id) return;
      const res = await fishingRepository.unlock(id);
      await this.loadInventory();
      uiStore.pushNotification(res?.data?.success ? 'success' : 'error', res?.data?.message || '낚시터 확장');
    } catch (e) {
      console.error(e);
      uiStore.pushNotification('error', '낚시터 확장 오류');
    }
  }
}

export const fishingStore = new FishingStore();
