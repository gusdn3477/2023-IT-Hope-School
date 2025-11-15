import { useState } from 'react';
import gameLogo from '../../assets/IT_HOPE_FISHING.png';
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
      <div
        style={{
          height: '100%',
          width: '450px',
          background: '#00000070',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ marginTop: '0', transition: 'margin-top 600ms ease' }}>
          <img
              src={gameLogo}
              className="logo"
              alt="logo"
              width={350}
              height={350}
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}
            />
        </div>
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
                  style={{ cursor: 'pointer' }}
                  onClick={() => setLoginModalOpen(true)}
                />
                <img
                  src={register}
                  width={240}
                  height={80}
                  style={{ cursor: 'pointer' }}
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
      </div>
    </S.LandingWrapper>
  );
});
