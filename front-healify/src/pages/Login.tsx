import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { runtimeStore } from '../store/userStore';
import { loginRequest } from '../api/userApi';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Логин или почта
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log('Попытка входа:', { identifier, password }); // Логин/почта + пароль
    try {
      const data = await loginRequest(identifier, password);

      // сохраняем токены
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      // отмечаем пользователя как залогиненного
      runtimeStore.setAuthenticated(true);

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}>
      <h2>🔑 Вход</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="identifier" style={{ display: 'block', marginBottom: '5px' }}>
            Логин / Почта:
          </label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Пароль:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
          Войти
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
      <p style={{ textAlign: 'center' }}>
        <Link to="/forgot-password">Забыли пароль?</Link>
      </p>
    </div>
  );
};

export default Login;
