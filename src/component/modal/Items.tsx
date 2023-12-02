import {
  StyledDialog,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledListItem,
  StyledListItemText,
} from './style';

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
import styled from 'styled-components';

export interface ItemModel {
  id: number;
  name: string;
}

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

const StyledTableCell = styled(TableCell)`
  font-family: 'Neo둥근모';
  word-break: keep-all;
`;

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
              <StyledTableCell align="center" style={{ width: '90px' }}>
                사진
              </StyledTableCell>
              <StyledTableCell align="center" style={{ width: '90px' }}>
                이름
              </StyledTableCell>
              <StyledTableCell align="center" style={{ width: '90px' }}>
                열매까지 기간
              </StyledTableCell>
              <StyledTableCell align="center" style={{ width: '90px' }}>
                갯수
              </StyledTableCell>
              <StyledTableCell align="center" style={{ width: '270px' }}>
                설명
              </StyledTableCell>
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
                <StyledTableCell align="center" component="th" scope="row">
                  <img src={item.bagImgSrc} width={60} height={60} />
                </StyledTableCell>
                <StyledTableCell align="center">
                  {item.name + '씨앗'}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {item.day + '일'}
                </StyledTableCell>
                <StyledTableCell align="center">{item.count}</StyledTableCell>
                <StyledTableCell align="center">
                  {item.description}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </StyledDialog>
    </>
  );
};
