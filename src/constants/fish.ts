export type Season = '봄' | '여름' | '가을' | '겨울';

export interface Fish {
  id: string;
  name: string;
  level: number; // difficulty 1..10
  price: number; // base sell price
  seasons: Season[]; // seasons available
  ground: number; // fishing ground tier 1..n
}

export const FISH_LIST: Fish[] = [
  { id: 'anchovy', name: '멸치', level: 1, price: 20, seasons: ['봄', '가을'], ground: 1 },
  { id: 'sardine', name: '정어리', level: 2, price: 30, seasons: ['봄', '겨울'], ground: 1 },
  { id: 'mackerel', name: '고등어', level: 3, price: 45, seasons: ['봄', '여름'], ground: 1 },
  { id: 'carp', name: '잉어', level: 4, price: 60, seasons: ['여름', '가을'], ground: 1 },
  { id: 'bass', name: '배스', level: 5, price: 80, seasons: ['여름'], ground: 2 },
  { id: 'salmon', name: '연어', level: 6, price: 120, seasons: ['가을'], ground: 2 },
  { id: 'eyetail', name: '눈가오리', level: 7, price: 160, seasons: ['겨울'], ground: 2 },
  { id: 'tuna', name: '참치', level: 8, price: 220, seasons: ['여름'], ground: 3 },
  { id: 'squid', name: '오징어', level: 6, price: 140, seasons: ['겨울'], ground: 3 },
  { id: 'eel', name: '장어', level: 7, price: 180, seasons: ['봄', '가을'], ground: 3 },
  { id: 'marlin', name: '청새치', level: 9, price: 300, seasons: ['여름'], ground: 4 },
  { id: 'shark', name: '상어', level: 10, price: 500, seasons: ['가을', '겨울'], ground: 4 },
];

export const getSeasonFromDay = (day: number): Season => {
  // 120-day year: 30 days per season
  const d = Math.max(1, day);
  const mod = (d - 1) % 120;
  if (mod < 30) return '봄';
  if (mod < 60) return '여름';
  if (mod < 90) return '가을';
  return '겨울';
};
