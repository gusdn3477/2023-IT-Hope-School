import { API } from '../API';

class FarmRepository {
  sleep() {
    return API.get('/sleep');
  }

  buy({ id }: { id: string }) {
    return API.post('/buy', { id });
  }

  harvest({ id }: { id: string }) {
    return API.post('/harvest', { id });
  }

  plant({ id }: { id: string }) {
    return API.post('/plant', { id });
  }
}
