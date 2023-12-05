import { StyledDialog, StyledDialogTitle } from './style';
import { ItemInterface, items as marketItems } from '../../constants/items';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChangeEvent, useEffect, useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { useStore } from '../../hooks/useStore';
import { marketStore } from '../../stores/MarketStore';
import { observer } from 'mobx-react-lite';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

const StyledTableCell = styled(TableCell)`
  font-family: 'Neo둥근모';
  word-break: keep-all;
`;

const StyledTextField = styled(TextField)`
  width: 80px;
  input {
    font-family: 'Neo둥근모';
  }
`;

export const MarketModal = observer((props: SimpleDialogProps) => {
  const { onClose, open } = props;
  const { userStore, marketStore } = useStore();

  const [selectedItemList, setSelectedItemList] = useState<ItemInterface[]>([]);
  const [failOpen, setFailOpen] = useState(false);

  const handleClose = () => {
    setSelectedItemList([]);
    onClose();
  };

  const handleCloseFail = () => {
    setFailOpen(false);
    handleClose();
  };

  const handleChangeItem = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    selectedItem: ItemInterface,
  ) => {
    let copiedItemList = _.cloneDeep(selectedItemList);
    let found = false;
    const num = Number(e.target.value);
    if (num === 0) {
      copiedItemList = copiedItemList.filter(
        (item) => item.id !== selectedItem.id,
      );
    } else {
      copiedItemList.map((item) => {
        if (item.id === selectedItem.id) {
          item.count = num;
          found = true;
        }
      });
      if (!found) {
        copiedItemList.push({ ...selectedItem, count: 1 });
      }
    }
    setSelectedItemList(copiedItemList);
  };

  const handleClickBuy = async () => {
    console.log(selectedItemList);
    const dto = {
      id: userStore.user.id,
      items: selectedItemList.map((item) => {
        return {
          itemId: item.id,
          count: item.count,
        };
      }),
    };
    const res = await marketStore.buy(dto);
    if (res) handleClose();
    else setFailOpen(true);
  };

  return (
    <>
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
          <Table>
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
                    <StyledTextField
                      id="outlined-number"
                      type="number"
                      defaultValue={0}
                      onChange={(e) => handleChangeItem(e, item)}
                      InputProps={{ inputProps: { min: 0, max: 10 } }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          onClick={handleClickBuy}
          style={{ height: '56px', fontFamily: 'Neo둥근모' }}
          disabled={selectedItemList.length === 0}
        >
          구입하기
        </Button>
      </StyledDialog>
      <Dialog open={failOpen} onClose={handleCloseFail}>
        <DialogTitle style={{ fontFamily: 'Neo둥근모' }}>
          {'잔액이 부족합니다'}
        </DialogTitle>
        <Button onClick={handleCloseFail} style={{ fontFamily: 'Neo둥근모' }}>
          {'닫기'}
        </Button>
      </Dialog>
    </>
  );
});
