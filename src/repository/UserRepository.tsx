import { API } from '../API';

class UserRepository {
  signUp({
    id,
    password,
    nick,
  }: {
    id: string;
    password: string;
    nick: string;
  }) {
  return API.post('/signup', { playerId: id, password, nickname: nick });
  }

  login({ id, password }: { id: string; password: string }) {
  return API.post('/login', { playerId: id, password });
  }

  getUser(id: string) {
  return API.post('/user', { playerId: id });
  }

  getLeaderboard(limit: number = 100, mode: 'all' | 'weekly' = 'all') {
    return API.post('/leaderboard', { limit, mode });
  }

  sendTransfer(payload: { fromPlayerId: string; toPlayerId: string; type: 'money'|'fish'; amount?: number; fishId?: number|string; quantity?: number; }) {
    return API.post('/transfer', payload);
  }

  searchUsers(query: string) {
    return API.post('/users', { query });
  }
}

export const userRepository = new UserRepository();
