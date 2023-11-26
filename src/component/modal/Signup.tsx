import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { RadioButtonsGroup } from '../signup/genderRadioButton';

interface SignupModalProps {
  open: boolean;
  handleClose: () => void;
}
export const SignupModal = ({ open, handleClose }: SignupModalProps) => {
  return (
    <Dialog open={open} onClose={handleClose} disableScrollLock>
      <DialogTitle>회원가입</DialogTitle>
      <DialogContent>
        <DialogContentText>
          간편하게 회원가입 후에 게임을 즐겨보세요!
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="아이디"
          fullWidth
          variant="standard"
        />
        <TextField
          margin="dense"
          id="nickname"
          label="닉네임"
          fullWidth
          variant="standard"
        />
        <TextField
          margin="dense"
          id="password"
          label="비밀번호"
          type="password"
          fullWidth
          variant="standard"
        />
        <TextField
          margin="dense"
          id="confirm-password"
          label="비밀번호 확인"
          type="password"
          fullWidth
          variant="standard"
        />
        <RadioButtonsGroup />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>닫기</Button>
        <Button onClick={handleClose}>회원가입</Button>
      </DialogActions>
    </Dialog>
  );
};
