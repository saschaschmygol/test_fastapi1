import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import AboutContent from './AboutContent';
import { runtimeStore } from '../store/userStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 40px',
    backgroundColor: '#1e1e1e', // Темный фон хедера
    color: '#e0e0e0', // Светлый текст
    borderBottom: '1px solid #333',
    width: '100%',
    boxSizing: 'border-box',
    position: 'fixed', // Фиксируем вверху
    top: 0,
    zIndex: 1000,
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    textDecoration: 'none',
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 15px',
    backgroundColor: '#333',
    color: '#e0e0e0',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'normal',
    transition: 'background-color 0.3s',
  };
  const handleSettingsClick = () => {
    if (runtimeStore.isAuthenticated) {
      // navigate('/settings');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <header style={headerStyle}>
        <Link to="/" style={logoStyle}>
          Healify
        </Link>

        <nav style={navStyle}>
          <button
            onClick={() => setIsAboutModalOpen(true)}
            style={{
              ...buttonStyle,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#e0e0e0',
              fontWeight: 'normal',
            }}>
            О нас
          </button>

          <button onClick={handleSettingsClick} style={buttonStyle}>
            Настройки ⚙️
          </button>
        </nav>
      </header>

      <Modal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} title="О проекте">
        <AboutContent />
      </Modal>
    </>
  );
};

export default Header;
