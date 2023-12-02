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
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useState } from 'react';

interface SignupModalProps {
  open: boolean;
  handleClose: () => void;
}
export const SignupModal = observer(
  ({ open, handleClose }: SignupModalProps) => {
    const { userStore } = useStore();
    const [id, setId] = useState('');
    const [nick, setNick] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const signup = async () => {
      await userStore.signup({
        id,
        password,
        regiDate: new Date(),
        nick,
        gender: 'male',
      });
    };

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
            onChange={(e) => setId(e.target.value)}
            variant="standard"
          />
          <StyledTextField
            margin="dense"
            id="nickname"
            label="닉네임"
            onChange={(e) => setNick(e.target.value)}
            fullWidth
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
          <StyledTextField
            margin="dense"
            id="confirm-password"
            label="비밀번호 확인"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            variant="standard"
          />
          <RadioButtonsGroup />
        </DialogContent>
        <StyledDialogActions>
          <StyledButton variant="contained" onClick={signup}>
            회원가입
          </StyledButton>
          <StyledButton variant="contained" onClick={handleClose}>
            닫기
          </StyledButton>
        </StyledDialogActions>
      </Dialog>
    );
  },
);
