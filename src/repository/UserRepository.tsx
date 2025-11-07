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
}

export const userRepository = new UserRepository();
