import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { ListItem } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';

interface MenuPopoverProps {
  anchorEl: any;
  handleClose: () => void;
}
export const MenuPopover = observer(
  ({ anchorEl, handleClose }: MenuPopoverProps) => {
    const open = !!anchorEl;
    const id = open ? 'simple-popover' : undefined;

    const { userStore } = useStore();
    return (
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disableScrollLock
      >
        <Typography sx={{ cursor: 'pointer' }}>
          <ListItem
            onClick={() => userStore.logout()}
            style={{ fontFamily: 'Neo둥근모' }}
          >
            로그아웃
          </ListItem>
        </Typography>
      </Popover>
    );
  },
);
