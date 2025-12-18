import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPasswordRequest } from '../api/userApi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Попытка сброса пароля:', { email, newPassword });
    setError(null);
    setSuccess(null);

    try {
      await resetPasswordRequest(email, newPassword);

      setSuccess('Пароль успешно изменён!');

      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err.message);
    }
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
      <h2>❓ Сброс пароля</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Почта:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px' }}>
            Новый пароль:
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
          Сбросить и установить новый пароль
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/login">Вернуться ко входу</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
