import unknownFish from '../assets/fish/unknown_fish.png';
import { FISH } from './fish';

const withBase = (path: string) => {
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}${path}`;
};

const buildFishImageMap = (): Record<string, string> => {
  const entries: Record<string, string> = {};
  for (let i = 1; i <= 25; i += 1) {
    const key = String(i);
    const customPath = FISH[key]?.image;
    const path = customPath ?? `/fish/${key}.png`;
    entries[key] = withBase(path);
  }
  entries['unknown'] = unknownFish;
  return entries;
};

export const FISH_IMAGES: Record<string, string> = buildFishImageMap();
