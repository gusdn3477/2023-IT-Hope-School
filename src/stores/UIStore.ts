import { makeAutoObservable } from 'mobx';

class UIStore {
  _selectedItemId = -1;
  _selectedFarmId = -1;

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
}

export const uiStore = new UIStore();
