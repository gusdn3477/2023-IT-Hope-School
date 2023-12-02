import { API } from '../API';

class UserRepository {
  signUp({
    id,
    password,
    regiDate,
    nick,
    gender,
  }: {
    id: string;
    password: string;
    regiDate: string;
    nick: string;
    gender: string;
  }) {
    return API.post('/signup', { id, password, regiDate, nick, gender });
  }

  login({ id, password }: { id: string; password: string }) {
    return API.post('/login', { id, password });
  }
}

export const userRepository = new UserRepository();
