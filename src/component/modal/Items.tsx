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
