import potatobag from '../assets/potatobag.png';
import grownPotato from '../assets/grown_potato.png';
import sweetPotatobag from '../assets/sweetpotatobag.png';
import grownSweetPotato from '../assets/grown_sweetpotato.png';
import carrotbag from '../assets/carrotbag.png';
import grownCarrot from '../assets/grown_carrot.png';
import melonbag from '../assets/melonbag.png';
import grownMelon from '../assets/grown_melon.png';
import tomatobag from '../assets/tomatobag.png';
import grownTomato from '../assets/grown_tomato.png';

export interface ItemInterface {
  id: string;
  name: string;
  bagImgSrc: string;
  price: number;
  day: number;
  count: number;
  description: string;
}
export const items = {
  '0': {
    id: '0',
    name: '감자',
    bagImgSrc: potatobag,
    grownImgSrc: grownPotato,
    price: 50,
    day: 1,
    count: 60,
    description:
      '수확 시에 3-5개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 15~20원이다.',
  },
  '1': {
    id: '1',
    name: '고구마',
    bagImgSrc: sweetPotatobag,
    grownImgSrc: grownSweetPotato,
    price: 60,
    day: 1,
    count: 60,
    description:
      '수확 시에 3-5개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 15~25원이다.',
  },
  '2': {
    id: '2',
    name: '당근',
    bagImgSrc: carrotbag,
    grownImgSrc: grownCarrot,
    price: 100,
    day: 2,
    count: 100,
    description:
      '수확 시에 1-2개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 45-60원이다.',
  },
  '3': {
    id: '3',
    name: '수박',
    bagImgSrc: melonbag,
    grownImgSrc: grownMelon,
    price: 1000,
    day: 3,
    count: 20,
    description:
      '수확 시에 3개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 300~500원이다.',
  },
  '4': {
    id: '4',
    name: '토마토',
    bagImgSrc: tomatobag,
    grownImgSrc: grownTomato,
    price: 500,
    day: 3,
    count: 20,
    description:
      '수확 시에 3-5개의 열매를 가질 수 있다. 개당 가격은 상태에 따라 다르며, 150~200원이다.',
  },
};
