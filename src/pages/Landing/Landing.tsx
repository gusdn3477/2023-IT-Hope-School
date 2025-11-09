import { useState, useEffect, useRef } from 'react';
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
  const [introDone, setIntroDone] = useState(false);
  const [overlayClosing, setOverlayClosing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (introDone) return;
    // If video ends or errors, close automatically
    const v = videoRef.current;
    if (v) {
      const onEnd = () => startClosing();
      const onError = () => startClosing();
      v.addEventListener('ended', onEnd);
      v.addEventListener('error', onError);
      // Fallback timeout in case video can't auto-play silently
      const fallback = setTimeout(() => startClosing(), 10000);
      return () => {
        v.removeEventListener('ended', onEnd);
        v.removeEventListener('error', onError);
        clearTimeout(fallback);
      };
    } else {
      const t = setTimeout(() => startClosing(), 4000);
      return () => clearTimeout(t);
    }
  }, [introDone]);

  const startClosing = () => {
    setOverlayClosing(true);
    setTimeout(() => {
      setIntroDone(true);
      setLoginModalOpen(true);
    }, 450);
  };

  return (
    <S.LandingWrapper>
      {!introDone && (
        <S.IntroOverlay closing={overlayClosing} onClick={startClosing}>
          <S.IntroBox>
            <S.IntroVideo
              ref={videoRef}
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              onLoadedMetadata={() => {
                // Try play programmatically in case browser blocks autoPlay without user gesture
                videoRef.current?.play().catch(() => {/* ignore */});
              }}
            />
            <S.IntroHint>클릭하거나 영상 종료 후 시작합니다...</S.IntroHint>
          </S.IntroBox>
        </S.IntroOverlay>
      )}
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
        <div style={{ marginTop: introDone ? '0' : '40px', transition: 'margin-top 600ms ease' }}>
          {introDone && (
            <img
              src={gameLogo}
              className="logo"
              alt="logo"
              width={350}
              height={350}
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}
            />
          )}
        </div>
        <S.ButtonsFadeContainer show={introDone}>
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
        </S.ButtonsFadeContainer>
      </div>
    </S.LandingWrapper>
  );
});
