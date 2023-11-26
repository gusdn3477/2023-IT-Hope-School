import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import potatobag from '../../assets/potatobag.png';
import sweetPotatobag from '../../assets/sweetpotatobag.png';
import carrotbag from '../../assets/carrotbag.png';
import melonbag from '../../assets/melonbag.png';
import tomatobag from '../../assets/tomatobag.png';
import {
  StyledDialog,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledListItem,
  StyledListItemText,
} from './style';

export interface ItemModel {
  id: number;
  name: string;
}
export const items = [
  {
    id: 0,
    name: '감자',
    imgSrc: potatobag,
    price: 50,
    day: 1,
    count: 50,
    description:
      '수확 시에 3-5개의 열매를 가질 수 있다. 개당 가격은 15~20원이다.',
  },
  {
    id: 1,
    name: '고구마',
    imgSrc: sweetPotatobag,
    price: 60,
    day: 1,
    count: 60,
    description:
      '수확 시에 3-5개의 열매를 가질 수 있다. 개당 가격은 15~25원이다.',
  },
  {
    id: 2,
    name: '당근',
    imgSrc: carrotbag,
    price: 100,
    day: 2,
    count: 100,
    description:
      '수확 시에 1-2개의 열매를 가질 수 있다. 개당 가격은 45-60원이다.',
  },
  {
    id: 3,
    name: '수박',
    imgSrc: melonbag,
    price: 1000,
    day: 3,
    count: 20,
    description:
      '수확 시에 3개의 열매를 가질 수 있다. 개당 가격은 300~500원이다.',
  },
  {
    id: 4,
    name: '토마토',
    imgSrc: tomatobag,
    price: 500,
    day: 3,
    count: 20,
    description:
      '수확 시에 3-5개의 열매를 가질 수 있다. 개당 가격은 150~200원이다.',
  },
];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  onClick?: () => void;
}

export const ItemsModal = (props: SimpleDialogProps) => {
  const { onClose, selectedValue, open, onClick } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <>
      <StyledDialog onClose={handleClose} open={open} disableScrollLock>
        <StyledDialogHeader onClick={handleClose}>X</StyledDialogHeader>
        <StyledDialogTitle>
          <b>아이템</b>
        </StyledDialogTitle>
        <List>
          <StyledListItem disableGutters>
            <StyledListItemText primary={'사진'} />
            <StyledListItemText primary={'이름'} />
            <StyledListItemText primary={'열매까지 날짜'} />
            <StyledListItemText primary={'갯수'} />
            <StyledListItemText primary={'설명'} />
          </StyledListItem>
          {items.map((item) => (
            <StyledListItem disableGutters key={item.id}>
              <ListItemButton>
                <ListItemAvatar>
                  <img src={item.imgSrc} width={60} height={60} />
                </ListItemAvatar>
                <StyledListItemText primary={item.name + '씨앗'} />
                <StyledListItemText primary={item.day + '일'} />
                <StyledListItemText primary={item.count} />
                <StyledListItemText primary={item.description} />
              </ListItemButton>
            </StyledListItem>
          ))}
        </List>
      </StyledDialog>
    </>
  );
};
