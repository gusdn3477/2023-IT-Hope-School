import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = observer(() => {
  const { userStore } = useStore();

  if (userStore.isLogin) return <Outlet />;
  return <Navigate to="/" replace />;
});

export default PrivateRoute;
