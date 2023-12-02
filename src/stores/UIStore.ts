import { makeAutoObservable } from 'mobx';

class UIStore {
  _selectedItemId = -1;
  _selectedFarmId = -1;
  _openMarketModal = false;
  _openItemModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedItemId(id: number) {
    this._selectedItemId = id;
  }

  get selectedItemId() {
    return this._selectedItemId;
  }

  setSelectedFarmId(id: number) {
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
}

export const uiStore = new UIStore();
