import { StyledDialog, StyledDialogTitle } from './style';
import { ItemInterface, items as marketItems } from '../../constants/items';
import {
  Button,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChangeEvent, useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

const StyledTableCell = styled(TableCell)`
  font-family: 'Neo둥근모';
  word-break: keep-all;
`;

export const MarketModal = (props: SimpleDialogProps) => {
  const { onClose, open } = props;

  const [selectedItemList, setSelectedItemList] = useState<ItemInterface[]>([]);

  const handleClose = () => {
    onClose();
  };

  const handleChangeItem = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    selectedItem: ItemInterface,
  ) => {
    console.log(selectedItem);
    const copiedItemList = _.cloneDeep(selectedItemList);
    let found = false;
    copiedItemList.map((item) => {
      if (item.id === selectedItem.id) {
        item.count = Number(e.target.value);
        found = true;
      }
    });
    if (!found) {
      copiedItemList.push({ ...selectedItem, count: 1 });
    }
    setSelectedItemList(copiedItemList);
  };

  const handleClickBuy = () => {
    console.log(selectedItemList);
    handleClose();
  };

  return (
    <StyledDialog onClose={handleClose} open={open} disableScrollLock>
      <StyledDialogTitle
        sx={{ m: 0, p: 2 }}
        id="customized-dialog-title"
        style={{ margin: 0 }}
      >
        {'상점'}
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
      <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
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
              가격
            </StyledTableCell>
            <StyledTableCell align="center" style={{ width: '270px' }}>
              설명
            </StyledTableCell>
            <StyledTableCell align="center" style={{ width: '80px' }}>
              개수
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {marketItems.map((item) => (
            <TableRow
              key={item.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell align="center" component="th" scope="row">
                <img src={item.bagImgSrc} width={60} height={60} />{' '}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.name + '씨앗'}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.day + '일'}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.price + '원'}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.description}
              </StyledTableCell>
              <StyledTableCell align="center">
                <TextField
                  id="outlined-number"
                  type="number"
                  defaultValue={0}
                  onChange={(e) => handleChangeItem(e, item)}
                  style={{ width: '80px' }}
                  InputProps={{ inputProps: { min: 0, max: 10 } }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
      <Button onClick={handleClickBuy} style={{ height: '56px' }}>
        구입하기
      </Button>
    </StyledDialog>
  );
};
