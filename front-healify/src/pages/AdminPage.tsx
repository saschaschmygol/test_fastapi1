import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useDropzone } from 'react-dropzone';

const AdminPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  const uploadFiles = async () => {
    if (files.length === 0) {
      setMessage('Нет файлов для загрузки');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // TODO: Логика отправки на бэк
      return;
    } catch (err) {
      setMessage('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        margin: '0 auto',
        backgroundColor: '#242424',
        minHeight: '100vh',
        color: '#fff',
      }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#fff' }}>
        Загрузить тест
      </Typography>

      {/* Drag-and-Drop Card */}
      <Card
        {...getRootProps()}
        sx={{
          mb: 3,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#2e2e2e',
          border: '2px dashed #555',
          color: '#fff',
          transition: '0.2s',
          '&:hover': { borderColor: '#888' },
          ...(isDragActive && { backgroundColor: '#3a3a3a', borderColor: '#aaa' }),
        }}>
        <input {...getInputProps()} />

        <CloudUploadIcon sx={{ fontSize: 60, mb: 1, color: '#bbb' }} />

        <Typography variant="h6" sx={{ color: '#fff' }}>
          Перетащите файлы сюда или нажмите, чтобы выбрать
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, color: '#ccc' }}>
          Доступные форматы: .doc, .docx, .xls, .xlsx
        </Typography>
      </Card>

      {/* File Preview */}
      {files.length > 0 && (
        <Card sx={{ mb: 3, backgroundColor: '#2e2e2e', color: '#fff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
              Выбранные файлы:
            </Typography>

            <List>
              {files.map((file, index) => (
                <ListItem key={index} sx={{ borderBottom: '1px solid #444' }}>
                  <ListItemIcon>
                    <InsertDriveFileIcon sx={{ color: '#bbb' }} />
                  </ListItemIcon>

                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{ style: { color: '#fff' } }}
                    secondary={`Размер: ${(file.size / 1024).toFixed(1)} KB`}
                    secondaryTypographyProps={{ style: { color: '#aaa' } }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={uploadFiles}
          disabled={loading || files.length === 0}
          startIcon={!loading && <CloudUploadIcon />}
          sx={{
            backgroundColor: '#4a90e2',
            '&:hover': { backgroundColor: '#357ABD' },

            // яркий disabled
            '&.Mui-disabled': {
              backgroundColor: 'rgba(74,144,226,0.6)',
              color: '#ffffff',
              opacity: 1,
            },
          }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Загрузить'}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => setFiles([])}
          disabled={loading || files.length === 0}
          sx={{
            borderColor: '#ff5555',
            color: '#ff5555',
            '&:hover': {
              borderColor: '#ff4444',
              backgroundColor: 'rgba(255, 50, 50, 0.1)',
            },

            // яркий disabled
            '&.Mui-disabled': {
              borderColor: 'rgba(255,85,85,0.8)',
              color: 'rgba(255,85,85,0.9)',
              opacity: 1,
            },
          }}>
          Очистить список
        </Button>
      </Box>

      {/* Messages */}
      {message && (
        <Alert severity="info" sx={{ mt: 3, backgroundColor: '#333', color: '#fff' }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default AdminPage;
