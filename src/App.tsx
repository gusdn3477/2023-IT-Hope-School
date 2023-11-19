import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Header } from './pages/Main/Header';
import Farms from './pages/Main/Farm/Farms';
import PrivateRoute from './component/route/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<PrivateRoute />}>
          <Route path="main" element={<Header />}>
            <Route path="" element={<Farms />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
