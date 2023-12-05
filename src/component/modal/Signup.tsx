import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
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
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import styled from 'styled-components';

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
    const [gender, setGender] = useState('female');

    const signup = async () => {
      const res = await userStore.signup({
        id,
        password,
        regiDate: new Date(),
        nick,
        gender,
      });

      if (res) handleClose();
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
          <FormControl>
            <FormLabel
              id="demo-radio-buttons-group-label"
              style={{ fontFamily: 'Neo둥근모' }}
            >
              성별
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <StyledFormControlLabel
                value="female"
                control={<Radio onClick={() => setGender('female')} />}
                label="여성"
              />
              <StyledFormControlLabel
                value="male"
                control={<Radio onClick={() => setGender('male')} />}
                label="남성"
              />
            </RadioGroup>
          </FormControl>
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

const StyledFormControlLabel = styled(FormControlLabel)`
  span {
    font-family: 'Neo둥근모';
  }
`;
