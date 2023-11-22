import { useState } from 'react';
import viteLogo from '/vite.svg';
import * as S from './style';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { SignupModal } from '../../component/modal/Signup';
import { LoginModal } from '../../component/modal/Login';
import { useNavigate } from 'react-router-dom';

export const Landing = observer(() => {
  const [count, setCount] = useState(0);
  const { userStore } = useStore();
  const navigate = useNavigate();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  return (
    <S.LandingWrapper>
      <div style={{ marginTop: '150px' }}>
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </div>
      <h1>Tmax IT 희망농장</h1>
      <S.ButtonWrapper>
        {userStore.isLogin ? (
          <>
            <S.StyledButton onClick={() => navigate('main')}>
              시작하기
            </S.StyledButton>
            <S.StyledButton onClick={() => userStore.logout()}>
              로그아웃
            </S.StyledButton>
          </>
        ) : (
          <>
            <S.StyledButton onClick={() => setLoginModalOpen(true)}>
              로그인
            </S.StyledButton>

            <S.StyledButton onClick={() => setSignupModalOpen(true)}>
              회원가입
            </S.StyledButton>

            <LoginModal
              open={loginModalOpen}
              handleClose={() => setLoginModalOpen(false)}
            />
            <SignupModal
              open={signupModalOpen}
              handleClose={() => setSignupModalOpen(false)}
            />
          </>
        )}
      </S.ButtonWrapper>
    </S.LandingWrapper>
  );
});
