import { userStore } from '../stores/UserStore';
import { uiStore } from '../stores/UIStore';
import { marketStore } from '../stores/MarketStore';
import { farmStore } from '../stores/FarmStore';

export const useStore = () => {
  return { userStore, uiStore, marketStore, farmStore };
};
