import { API } from '../API';

class MarketRepository {
  // 아이템 다 불러와야 할 듯
  get() {
    return API.get('/market');
  }

  buy({ id, itemId }: { id: string; itemId: string }) {
    return API.post('buy', {
      id,
      itemId,
    });
  }
}

export const marketRepository = new MarketRepository();
