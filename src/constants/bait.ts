export interface Bait {
  id: string;
  name: string;
  effect: number; // adds to control/marker movement or widens success zone
  price: number;
}

export const BAITS: Bait[] = [
  { id: 'basic', name: '기본 미끼', effect: 2, price: 20 },
  { id: 'silver', name: '은빛 미끼', effect: 4, price: 60 },
  { id: 'gold', name: '황금 미끼', effect: 6, price: 120 },
];
