import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { blue } from '@mui/material/colors';

const marketItems = [
  {
    id: 1,
    name: '감자',
    price: 50,
    day: 1,
  },
  {
    id: 2,
    name: '고구마',
    price: 60,
    day: 1,
  },
  {
    id: 3,
    name: '당근',
    price: 100,
    day: 2,
  },
  {
    id: 5,
    name: '토마토',
    price: 500,
    day: 3,
  },
  {
    id: 4,
    name: '수박',
    price: 1000,
    day: 3,
  },
];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export const ItemsModal = (props: SimpleDialogProps) => {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>아이템</DialogTitle>
      <List sx={{ width: '400px' }}>
        <ListItem disableGutters>
          <ListItemText primary={'사진'} />
          <ListItemText primary={'이름'} />
          <ListItemText primary={'열매까지 날짜'} />
          <ListItemText primary={'갯수'} />
        </ListItem>
        {marketItems.map((item) => (
          <ListItem disableGutters key={item.id}>
            <ListItemButton onClick={() => handleListItemClick('123')}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
              <ListItemText primary={item.day} />
              <ListItemText primary={item.price} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};