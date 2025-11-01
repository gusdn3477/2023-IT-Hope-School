import { makeAutoObservable } from 'mobx';
import type { Fish } from '../constants/fish';
import { BAITS } from '../constants/bait';
import { userStore } from './UserStore';

class FishingStore {
  rodLevel = 1;
  groundLevel = 1; // unlocked fishing area tier
  selectedBaitId: string = 'basic';
  baitInventory: Record<string, number> = { basic: 5 };
  fishBag: Record<string, number> = {}; // fishId -> count
  caughtFish: string[] = []; // fish dex

  constructor() {
    makeAutoObservable(this);
  }

  get selectedBait() {
    return BAITS.find((b) => b.id === this.selectedBaitId) ?? BAITS[0];
  }

  setSelectedBait(id: string) {
    this.selectedBaitId = id;
  }

  addBait(id: string, count: number) {
    this.baitInventory[id] = (this.baitInventory[id] ?? 0) + count;
  }

  useBait(id: string) {
    if ((this.baitInventory[id] ?? 0) > 0) {
      this.baitInventory[id] -= 1;
      return true;
    }
    return false;
  }

  catchFish(fish: Fish) {
    // Add to bag
    this.fishBag[fish.id] = (this.fishBag[fish.id] ?? 0) + 1;
    // Update dex
    if (!this.caughtFish.includes(fish.id)) this.caughtFish.push(fish.id);
  }

  sellFish(items: { fishId: string; price: number; count: number }[]) {
    let total = 0;
    for (const it of items) {
      const have = this.fishBag[it.fishId] ?? 0;
      const sellCount = Math.min(have, it.count);
      if (sellCount <= 0) continue;
      this.fishBag[it.fishId] = have - sellCount;
      total += sellCount * it.price;
    }
    // Add to user money if available
    const us = userStore as unknown as { user?: { money?: number } };
    if (us.user && typeof us.user.money === 'number') {
      us.user.money += total;
    }
    return total;
  }

  buyBait(baitId: string, count: number, pricePerUnit: number) {
    const cost = count * pricePerUnit;
    const us = userStore as unknown as { user?: { money?: number } };
    const money: number = (us.user?.money ?? 0) as number;
    if (count <= 0) return false;
    if (money < cost) return false;
    if (us.user && typeof us.user.money === 'number') {
      us.user.money -= cost;
    }
    this.addBait(baitId, count);
    return true;
  }

  upgradeRod() {
    const cost = this.getUpgradeCost();
    const us = userStore as unknown as { user?: { money?: number } };
    const money: number = (us.user?.money ?? 0) as number;
    if (money < cost) return false;
    if (us.user && typeof us.user.money === 'number') {
      us.user.money -= cost;
    }
    this.rodLevel += 1;
    return true;
  }

  getUpgradeCost() {
    return this.rodLevel * 200; // simple scaling
  }

  get dexCompletion() {
    // computed elsewhere with total list; here only caught length available
    return this.caughtFish.length;
  }

  canExpand(totalFishCount: number) {
    // Unlock next ground every 25% dex completion
    const ratio = totalFishCount === 0 ? 0 : this.caughtFish.length / totalFishCount;
    const required = this.groundLevel * 0.25; // 25%, 50%, 75%, ...
    return ratio >= required;
  }

  expand(totalFishCount: number) {
    if (this.canExpand(totalFishCount)) this.groundLevel += 1;
  }
}

export const fishingStore = new FishingStore();
