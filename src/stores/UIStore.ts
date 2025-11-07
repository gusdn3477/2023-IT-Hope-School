import { makeAutoObservable } from 'mobx';

class UIStore {
  _selectedItemId = -1;
  _selectedFarmId = '';
  _openMarketModal = false;
  _openItemModal = false;
  notifications: { id: number; type: 'success' | 'error' | 'info'; message: string; createdAt: number }[] = [];
  _nextId = 1;

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedItemId(id: number) {
    this._selectedItemId = id;
  }

  get selectedItemId() {
    return this._selectedItemId;
  }

  setSelectedFarmId(id: string) {
    this._selectedFarmId = id;
  }

  get selectedFarmId() {
    return this._selectedFarmId;
  }

  setOpenMarketModal(open: boolean) {
    this._openMarketModal = open;
  }

  get openMarketModal() {
    return this._openMarketModal;
  }

  setOpenItemModal(open: boolean) {
    this._openItemModal = open;
  }

  get openItemModal() {
    return this._openItemModal;
  }

  pushNotification(type: 'success' | 'error' | 'info', message: string) {
    const n = { id: this._nextId++, type, message, createdAt: Date.now() };
    this.notifications.push(n);
    setTimeout(() => this.removeNotification(n.id), 4000);
  }

  removeNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  clearNotifications() {
    this.notifications = [];
  }
}

export const uiStore = new UIStore();
