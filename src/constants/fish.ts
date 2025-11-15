import fishData from '../../fish.json';

export interface FishInfo {
  name: string;
  level: number;
  price: number;
  rate: number;
  image?: string;
}

export const FISH: Record<string, FishInfo> = fishData as Record<string, FishInfo>;
