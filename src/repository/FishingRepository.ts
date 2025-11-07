import { API } from '../API';

class FishingRepository {
  upgradeRod(playerId: string) {
  return API.post('/rod/upgrade', { playerId });
  }

  doFishing(playerId: string, baitId: string, score?: number) {
    return API.post('/fishing', { playerId, baitId, score });
  }

  startEncounter(playerId: string, baitId: string) {
    return API.post('/fishing/encounter', { playerId, baitId });
  }

  resolveEncounter(playerId: string, encounterId: string, score: number) {
    return API.post('/fishing/resolve', { playerId, encounterId, score });
  }

  buyBait(playerId: string, baitId: string, quantity: number) {
  return API.post('/bait/buy', { playerId, baitId, quantity });
  }

  sellFish(playerId: string, fishId: string, quantity: number) {
  return API.post('/fish/sell', { playerId, fishId, quantity });
  }

  getInventory(playerId: string) {
  return API.post('/inventory', { playerId });
  }

  unlock(playerId: string) {
  return API.post('/unlock', { playerId });
  }

  getEncyclopedia(playerId: string) {
  return API.post('/encyclopedia', { playerId });
  }

  getEncyclopediaOfFish(playerId: string, fishId: string) {
  return API.post('/encyclopedia/fish', { playerId, fishId });
  }
}

export const fishingRepository = new FishingRepository();
