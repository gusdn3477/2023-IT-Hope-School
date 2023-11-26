import { userStore } from '../stores/UserStore';
import { uiStore } from '../stores/UIStore';

export const useStore = () => {
  return { userStore, uiStore };
};
