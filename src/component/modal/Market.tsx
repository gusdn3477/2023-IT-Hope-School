import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Dialog from '@mui/material/Dialog';
import {
  StyledDialog,
  StyledDialogTitle,
  StyledListItem,
  StyledListItemText,
} from './style';
import { items as marketItems } from './Items';

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
    <StyledDialog onClose={handleClose} open={open} disableScrollLock>
      <StyledDialogTitle>
        <b>상점</b>
      </StyledDialogTitle>
      <List>
        <StyledListItem disableGutters>
          <StyledListItemText primary={'사진'} />
          <StyledListItemText primary={'이름'} />
          <StyledListItemText primary={'수확까지 필요한 일수'} />
          <StyledListItemText primary={'가격'} />
          <StyledListItemText primary={'설명'} />
        </StyledListItem>
        {marketItems.map((item) => (
          <StyledListItem disableGutters key={item.id}>
            <ListItemButton onClick={() => handleListItemClick('123')}>
              <ListItemAvatar>
                <img src={item.imgSrc} width={60} height={60} />
              </ListItemAvatar>
              <StyledListItemText primary={item.name + '씨앗'} />
              <StyledListItemText primary={item.day + '일'} />
              <StyledListItemText primary={item.price + '원'} />
              <StyledListItemText primary={item.description} />
            </ListItemButton>
          </StyledListItem>
        ))}
      </List>
    </StyledDialog>
  );
};
