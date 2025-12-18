import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorPageProps {
  statusCode?: 400 | 404 | 500;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode: propStatusCode }) => {
  let statusCode = propStatusCode || 500;
  let title = 'Что-то пошло не так...';
  let message = 'Произошла непредвиденная ошибка.';

  const background = '#282828';
  const accentColor = '#ffc107';
  const textColor = '#e0e0e0';

  const buttonBackground = '#cc0000';
  const buttonHover = '#ff3333';

  if (statusCode === 404) {
    title = 'Страница не найдена';
    message = 'Извините, мы не смогли найти страницу, которую вы ищете.';
  } else if (statusCode >= 400 && statusCode < 500) {
    title = 'Неправильный запрос';
    message = 'Ваш запрос содержит ошибку. Проверьте введенные данные.';
  }

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50px',
        backgroundColor: background,
        color: textColor,
        border: `1px solid ${accentColor}`,
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '50px auto',
      }}>
      <h1 style={{ fontSize: '72px', margin: '0', color: accentColor }}>{statusCode}</h1>
      <h2 style={{ color: textColor }}>🚧 {title}</h2>
      <p style={{ fontSize: '18px', color: '#aaaaaa' }}>{message}</p>
      <Link
        to="/login"
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: buttonBackground,
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHover)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonBackground)}>
        Перейти на страницу входа
      </Link>
    </div>
  );
};

export default ErrorPage;
