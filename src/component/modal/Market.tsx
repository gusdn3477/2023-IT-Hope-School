import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import potatobag from '../../assets/potatobag.png';
import sweetPotatobag from '../../assets/sweetpotatobag.png';
import carrotbag from '../../assets/carrotbag.png';
import melonbag from '../../assets/melonbag.png';
import tomatobag from '../../assets/tomatobag.png';

const marketItems = [
  {
    id: 1,
    name: '감자',
    imgSrc: potatobag,
    price: 50,
    day: 1,
  },
  {
    id: 2,
    name: '고구마',
    imgSrc: sweetPotatobag,
    price: 60,
    day: 1,
  },
  {
    id: 3,
    name: '당근',
    imgSrc: carrotbag,
    price: 100,
    day: 2,
  },
  {
    id: 4,
    name: '수박',
    imgSrc: melonbag,
    price: 1000,
    day: 3,
  },
  {
    id: 5,
    name: '토마토',
    imgSrc: tomatobag,
    price: 500,
    day: 3,
  },
];
export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export const MarketModal = (props: SimpleDialogProps) => {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open} disableScrollLock>
      <DialogTitle>상점</DialogTitle>
      <List sx={{ width: '400px' }}>
        <ListItem disableGutters>
          <ListItemText primary={'사진'} />
          <ListItemText primary={'이름'} />
          <ListItemText primary={'수확까지 필요한 일수'} />
          <ListItemText primary={'가격'} />
        </ListItem>
        {marketItems.map((item) => (
          <ListItem disableGutters key={item.id}>
            <ListItemButton onClick={() => handleListItemClick('123')}>
              <ListItemAvatar>
                <img src={item.imgSrc} width={24} height={24} />
              </ListItemAvatar>
              <ListItemText primary={item.name + '씨앗'} />
              <ListItemText primary={item.day} />
              <ListItemText primary={item.price + '원'} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};
