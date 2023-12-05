import { StyledDialog, StyledDialogTitle } from './style';

import {
  IconButton,
  Paper,
  Table,
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
import { observer } from 'mobx-react-lite';

export interface ItemModel {
  id: string;
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

export const ItemsModal = observer((props: SimpleDialogProps) => {
  const { onClose, open } = props;

  const { uiStore, userStore, farmStore } = useStore();

  const handleClose = () => {
    onClose();
  };

  const handleClickItem = async (item: ItemInterface) => {
    if (uiStore.selectedFarmId !== '') {
      console.log(uiStore.selectedFarmId, item);
      const res = await farmStore.plant({
        id: userStore.user.id,
        farmId: uiStore.selectedFarmId,
        itemId: item.id,
      });
    }
    handleClose();
  };

  // TODO: userStore.user.bag 이 객체라 map 함수를 못 씀
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
        <TableContainer>
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
                  갯수
                </StyledTableCell>
                <StyledTableCell align="center" style={{ width: '270px' }}>
                  설명
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(userStore.user.bag) &&
                Object.values(userStore.user.bag).map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClickItem(items[item.id])}
                  >
                    <StyledTableCell align="center" component="th" scope="row">
                      <img
                        src={items[item.id].bagImgSrc}
                        width={60}
                        height={60}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {items[item.id].name + '씨앗'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {items[item.id].day + '일'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.count}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {items[item.id].description}
                    </StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledDialog>
    </>
  );
});
