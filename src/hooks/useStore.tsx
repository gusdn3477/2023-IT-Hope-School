import { userStore } from '../stores/UserStore';
import { uiStore } from '../stores/UIStore';
import { fishingStore } from '../stores/FishingStore';

export const useStore = () => {
  return { userStore, uiStore, fishingStore };
};
