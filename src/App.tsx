import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Header } from './pages/Main/Header';
import Fishing from './pages/Main/Fishing/Fishing';
import PrivateRoute from './component/route/PrivateRoute';
import { useEffect } from 'react';
import NotificationCenter from './component/notification/NotificationCenter';
import { useStore } from './hooks/useStore';

const App = () => {
  const { userStore } = useStore();

  // 앱 마운트 또는 로그인 상태 변경 시, 로그인된 유저라면 즉시 동기화
  useEffect(() => {
    if (userStore.isLogin) {
      userStore.refreshUserState();
    }
  }, [userStore, userStore.isLogin]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<PrivateRoute />}>
          <Route path="main" element={<Header />}>
            <Route path="" element={<Fishing />} />
          </Route>
        </Route>
      </Routes>
      <NotificationCenter />
    </BrowserRouter>
  );
};

export default App;
