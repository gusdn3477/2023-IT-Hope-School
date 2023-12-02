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
import { useState } from 'react';

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
}
export const LoginModal = observer(({ open, handleClose }: LoginModalProps) => {
  const { userStore } = useStore();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    userStore.login({
      id,
      password,
    });
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
          onChange={(e) => setId(e.target.value)}
          variant="standard"
        />
        <StyledTextField
          margin="dense"
          id="password"
          label="비밀번호"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
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
