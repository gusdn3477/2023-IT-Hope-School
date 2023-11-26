import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { RadioButtonsGroup } from '../signup/GenderSelectRadioButton';
import {
  StyledButton,
  StyledDialogActions,
  StyledDialogContentText,
  StyledDialogTitle,
  StyledTextField,
} from './style';

interface SignupModalProps {
  open: boolean;
  handleClose: () => void;
}
export const SignupModal = ({ open, handleClose }: SignupModalProps) => {
  return (
    <Dialog open={open} onClose={handleClose} disableScrollLock>
      <StyledDialogTitle>회원가입</StyledDialogTitle>
      <DialogContent>
        <StyledDialogContentText>
          간편하게 회원가입 후에 게임을 즐겨보세요!
        </StyledDialogContentText>
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
          id="nickname"
          label="닉네임"
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
        <StyledTextField
          margin="dense"
          id="confirm-password"
          label="비밀번호 확인"
          type="password"
          fullWidth
          variant="standard"
        />
        <RadioButtonsGroup />
      </DialogContent>
      <StyledDialogActions>
        <StyledButton variant="contained" onClick={handleClose}>
          회원가입
        </StyledButton>
        <StyledButton variant="contained" onClick={handleClose}>
          닫기
        </StyledButton>
      </StyledDialogActions>
    </Dialog>
  );
};
