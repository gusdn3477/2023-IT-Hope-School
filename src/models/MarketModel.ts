import { makeAutoObservable } from 'mobx';

export interface MarketInterface {
  id: string;
  name: string;
  price: number;
  term: number;
}

export class MarketModel implements MarketInterface {
  id: string;
  name: string;
  price: number;
  term: number;

  constructor(market: MarketInterface) {
    this.id = market.id;
    this.name = market.name;
    this.price = market.price;
    this.term = market.term;
  }
}
