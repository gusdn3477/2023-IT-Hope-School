import { API } from '../API';

class MarketRepository {
  // 아이템 다 불러와야 할 듯
  get() {
    return API.get('/market');
  }

  buy(dto: { id: string; items: { itemId: string; count: number }[] }) {
    return API.post('/buy', dto);
  }
}

export const marketRepository = new MarketRepository();
