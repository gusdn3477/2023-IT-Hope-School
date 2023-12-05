import potatobag from '../assets/potatobag.png';
import sweetPotatobag from '../assets/sweetpotatobag.png';
import carrotbag from '../assets/carrotbag.png';
import melonbag from '../assets/melonbag.png';
import tomatobag from '../assets/tomatobag.png';

export interface ItemInterface {
  id: number; // 스트링으로 변경해야될듯
  name: string;
  bagImgSrc: string;
  price: number;
  day: number;
  count: number;
  description: string;
}
export const items = [
  {
    id: 0,
    name: '감자',
    bagImgSrc: potatobag,
    price: 50,
    day: 1,
    count: 60,
    description:
      '수확 시에 3-5개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 15~20원이다.',
  },
  {
    id: 1,
    name: '고구마',
    bagImgSrc: sweetPotatobag,
    price: 60,
    day: 1,
    count: 60,
    description:
      '수확 시에 3-5개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 15~25원이다.',
  },
  {
    id: 2,
    name: '당근',
    bagImgSrc: carrotbag,
    price: 100,
    day: 2,
    count: 100,
    description:
      '수확 시에 1-2개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 45-60원이다.',
  },
  {
    id: 3,
    name: '수박',
    bagImgSrc: melonbag,
    price: 1000,
    day: 3,
    count: 20,
    description:
      '수확 시에 3개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 300~500원이다.',
  },
  {
    id: 4,
    name: '토마토',
    bagImgSrc: tomatobag,
    price: 500,
    day: 3,
    count: 20,
    description:
      '수확 시에 3-5개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 150~200원이다.',
  },
];
