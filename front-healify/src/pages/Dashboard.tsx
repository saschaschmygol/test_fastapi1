import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { runtimeStore } from '../store/userStore';
import { Button, Container, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import QrModal from '../components/QrModal';
import TestModal from '../components/TestModal';
import { ReportModal, type ResultItem } from '../components/ReportModal';
import { sendTestContentsRequest } from '../api/userApi';

type TestOption = string;
//должно идти с бека
const initialTestOptions: TestOption[] = [
  'PSS-4',
  'PSS-10',
  'Опросник "Стресс"',
  'Опросник "Тревожность"',
  'Опросник "Суицидальные мысли"',
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState<TestOption[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ResultItem[]>([]);
  const [isWsOpen, setIsWsOpen] = useState(false);
  const [paired, setPaired] = useState(false)
  const wsRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleSendTests = async (tests: TestOption[]) => {
    setSelectedTests(tests);
    if (!sessionToken) {
      toast.error('Сессия для передачи не создана!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      return;
    }
    if (!paired){
      toast.error('Приложение не подключено!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        return;
    }
    await sendTestContentsRequest(sessionToken, 1);
    setIsTestModalOpen(false);
    toast.success('Тесты отправлены', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark"
    });
  };

  const handleLogout = () => {
    runtimeStore.setAuthenticated(false);
    closeWebsocket()
    alert('Выход из системы...');
    navigate('/login');
  };

  const openWebsocket = (token: string) => {
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(`ws://localhost:8000/session/ws?session=${token}&type=client`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WS OPEN');
      setIsWsOpen(true);

      timeoutRef.current = window.setTimeout(() => {
        console.log('Auto WS close');
        ws.close();
      }, 15 * 60 * 1000);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log(msg)
        if (msg.event === 'test_contents'){
          console.log('ok')
          return;
        }
        if (msg.event === 'paired') {
          setPaired(true)
          toast.success('Приложение подключено!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        } else {
          setReportData(msg);
        }
      } catch (e) {
        console.error('Bad JSON', e);
      }
    };

    ws.onclose = () => {
      console.log('WS CLOSED');
      setIsWsOpen(false);
      setReportData([]);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      wsRef.current = null;
    };
  };

  const closeWebsocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      setReportData([]);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          Главная страница
        </Typography>
        <Box
          sx={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4a90e2',
              '&:hover': { backgroundColor: '#357ABD' },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(74,144,226,0.6)',
                color: '#ffffff',
                opacity: 1,
              },
            }}
            size="large"
            fullWidth
            onClick={() => setIsQrModalOpen(true)}>
            Генерация QR
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4a90e2',
              '&:hover': { backgroundColor: '#357ABD' },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(74,144,226,0.6)',
                color: '#ffffff',
                opacity: 1,
              },
            }}
            size="large"
            fullWidth
            onClick={() => setIsTestModalOpen(true)}>
            Отправить тест
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4a90e2',
              '&:hover': { backgroundColor: '#357ABD' },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(74,144,226,0.6)',
                color: '#ffffff',
                opacity: 1,
              },
            }}
            size="large"
            fullWidth
            disabled={!reportData.length}
            onClick={() => setIsReportModalOpen(true)}>
            Отчет по тестам
          </Button>
          <Button
            variant="outlined"
            sx={{
              backgroundColor: '#4a90e2',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#357ABD',
                color: '#ffffff',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(74,144,226,0.6)',
                color: '#ffffff',
                opacity: 1,
              },
            }}
            disabled={!isWsOpen}
            size="large"
            onClick={closeWebsocket}>
            Закончить сессию
          </Button>
          <Button variant="outlined" color="error" size="large" onClick={handleLogout}>
            Выход из системы
          </Button>
        </Box>
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          data={reportData}
        />
        <QrModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          onTokenReady={(token) => {
            setSessionToken(token);
            openWebsocket(token);
          }}
        />
        <TestModal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          availableTests={initialTestOptions}
          onSend={handleSendTests}
          initialSelected={selectedTests}
        />
        {/* Потом возможно убрать */}
        {selectedTests.length > 0 && (
          <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <Typography variant="body1">
              Последние отправленные тесты: {selectedTests.join(', ')}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
