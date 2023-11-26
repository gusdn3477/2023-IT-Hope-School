import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import {
  StyledButton,
  StyledDialogActions,
  StyledDialogTitle,
  StyledTextField,
} from './style';

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
}
export const LoginModal = observer(({ open, handleClose }: LoginModalProps) => {
  const { userStore } = useStore();

  const handleLogin = () => {
    userStore.login();
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose} disableScrollLock>
      <StyledDialogTitle>로그인</StyledDialogTitle>
      <DialogContent>
        <StyledTextField
          autoFocus
          margin="dense"
          id="name"
          label="아이디"
          fullWidth
          variant="standard"
        />
        <StyledTextField
          margin="dense"
          id="password"
          label="비밀번호"
          type="password"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <StyledDialogActions>
        <StyledButton onClick={handleLogin}>로그인</StyledButton>
        <StyledButton onClick={handleClose}>닫기</StyledButton>
      </StyledDialogActions>
    </Dialog>
  );
});
