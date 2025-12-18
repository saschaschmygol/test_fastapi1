// QrModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Box, Typography, Button } from '@mui/material';
import TokenQR from './QRCode';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenReady: (token: string) => void;
}

const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, onTokenReady }) => {
  const [token, setToken] = useState('');
  useEffect(() => {
    fetch(' http://localhost:8000/session/create_session')
      .then((res) => res.json())
      .then((data) => setToken(data.sessionId));
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose(), onTokenReady(token);
      }}
      title="🔐 Генерация QR-кода для входа">
      <Box
        sx={{
          width: 256,
          height: 256,
          bgcolor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px auto',
          borderRadius: '8px',
          color: '#fff',
        }}>
        {token ? <TokenQR token={token} /> : 'Загрузка токена...'}
      </Box>

      <Typography variant="body1" sx={{ mt: 2, color: 'inherit' }}>
        Отсканируйте этот QR-код с помощью мобильного приложения, чтобы добавить пациента. Код
        действителен в течение XX минут.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onClose(), onTokenReady(token);
          }}>
          Закрыть
        </Button>
      </Box>
    </Modal>
  );
};

export default QrModal;
