import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite'; // 👈 Импортируем observer
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';
import AdminPage from './pages/AdminPage';
import { runtimeStore } from './store/userStore';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = observer(() => {
  const isAuthenticated = runtimeStore.isAuthenticated;

  return (
    <BrowserRouter>
      <Header />
      <div style={{ width: '100%', maxWidth: '450px', marginTop: '70px', padding: '0 20px' }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/error" element={<ErrorPage statusCode={500} />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<ErrorPage statusCode={404} />} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
});

export default App;
