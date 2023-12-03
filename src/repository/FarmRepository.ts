import { API } from '../API';

class FarmRepository {
  sleep({ id }: { id: string }) {
    return API.post('/sleep', { id });
  }

  buy({ id, itemId }: { id: string; itemId: string }) {
    return API.post('/buy', { id, itemId });
  }

  harvest({
    id,
    farmId,
    money,
  }: {
    id: string;
    farmId: string;
    money: number;
  }) {
    return API.post('/harvest', { id, farmId, money });
  }

  plant({
    id,
    farmId,
    itemId,
  }: {
    id: string;
    farmId: string;
    itemId: string;
  }) {
    return API.post('/plant', { id, farmId, itemId });
  }
}

export const farmRepository = new FarmRepository();
