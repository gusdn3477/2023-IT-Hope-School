import { useState } from 'react';
import gameLogo from '/logo.png';
import * as S from './style';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { SignupModal } from '../../component/modal/Signup';
import { LoginModal } from '../../component/modal/Login';
import { useNavigate } from 'react-router-dom';
import login from '../../assets/login.png';
import register from '../../assets/register.png';
import logout from '../../assets/logout.png';
import play from '../../assets/play.png';

export const Landing = observer(() => {
  const { userStore } = useStore();
  const navigate = useNavigate();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  return (
    <S.LandingWrapper>
      <div style={{ marginTop: '70px' }}>
        <img
          src={gameLogo}
          className="logo"
          alt="logo"
          width={200}
          height={200}
        />
      </div>
      <h1>IT 희망농장</h1>
      <S.ButtonWrapper>
        {userStore.isLogin ? (
          <>
            <img
              src={play}
              width={240}
              height={80}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('main')}
            />
            <img
              src={logout}
              width={240}
              height={80}
              style={{ cursor: 'pointer' }}
              onClick={() => userStore.logout()}
            />
          </>
        ) : (
          <>
            <img
              src={login}
              width={240}
              height={80}
              onClick={() => setLoginModalOpen(true)}
            />

            <img
              src={register}
              width={240}
              height={80}
              onClick={() => setSignupModalOpen(true)}
            />

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
