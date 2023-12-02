import { StyledDialog, StyledDialogTitle } from './style';
import {
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ItemInterface, items } from '../../constants/items';
import { useStore } from '../../hooks/useStore';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ItemsModal = (props: SimpleDialogProps) => {
  const { onClose, open } = props;

  const { uiStore } = useStore();

  const handleClose = () => {
    onClose();
  };

  const handleClickItem = (item: ItemInterface) => {
    if (uiStore.selectedFarmId !== -1) {
      console.log(uiStore.selectedFarmId, item);
    }
    handleClose();
  };

  return (
    <>
      <StyledDialog onClose={handleClose} open={open} disableScrollLock>
        <StyledDialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          style={{ margin: 0 }}
        >
          {'아이템'}
        </StyledDialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <TableContainer component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ width: '90px' }}>
                사진
              </TableCell>
              <TableCell align="center" style={{ width: '90px' }}>
                이름
              </TableCell>
              <TableCell align="center" style={{ width: '90px' }}>
                열매까지 기간
              </TableCell>
              <TableCell align="center" style={{ width: '90px' }}>
                갯수
              </TableCell>
              <TableCell align="center" style={{ width: '270px' }}>
                설명
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                style={{ cursor: 'pointer' }}
                onClick={() => handleClickItem(item)}
              >
                <TableCell align="center" component="th" scope="row">
                  <img src={item.bagImgSrc} width={60} height={60} />
                </TableCell>
                <TableCell align="center">{item.name + '씨앗'}</TableCell>
                <TableCell align="center">{item.day + '일'}</TableCell>
                <TableCell align="center">{item.count}</TableCell>
                <TableCell align="center">{item.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>

        {/* <List style={{ overflowY: 'auto', padding: '20px' }}>
          <StyledListItem disableGutters>
            <StyledListItemText primary={'사진'} style={{ width: '80px' }} />
            <StyledListItemText primary={'이름'} style={{ width: '90px' }} />
            <StyledListItemText
              primary={'열매까지 날짜'}
              style={{ width: '70px', wordBreak: 'keep-all' }}
            />
            <StyledListItemText primary={'갯수'} style={{ width: '80px' }} />
            <StyledListItemText primary={'설명'} style={{ width: '200px' }} />
          </StyledListItem>
          {items.map((item) => (
            <StyledListItem disableGutters key={item.id}>
              <ListItemAvatar style={{ width: '80px' }}>
                <img src={item.bagImgSrc} width={60} height={60} />
              </ListItemAvatar>
              <StyledListItemText
                primary={item.name + '씨앗'}
                style={{ width: '90px' }}
              />
              <StyledListItemText
                primary={item.day + '일'}
                style={{ width: '70px' }}
              />
              <StyledListItemText
                primary={item.count}
                style={{ width: '80px' }}
              />
              <StyledListItemText
                primary={item.description}
                style={{ width: '200px' }}
              />
            </StyledListItem>
          ))}
        </List> */}
      </StyledDialog>
    </>
  );
};
