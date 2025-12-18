// TestModal.tsx
import React, { useRef, useState, useEffect } from 'react';
import Modal from './Modal';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import type { SelectChangeEvent } from '@mui/material/Select';
// Тип для доступных тестов

type TestOption = string;
const TEST_DESCRIPTIONS: Record<TestOption, string> = {
  'PSS-4':
    'Краткая версия методики для оценки общего уровня субъективно воспринимаемого стресса за последний месяц.',
  'PSS-10':
    'Расширенный вариант методики, измеряющий степень, в которой человек считает ситуации в своей жизни неконтролируемыми, непредсказуемыми и перегружающими его ресурсы в течение последнего месяца.',
  'Опросник "Стресс"':
    'Инструмент для выявления и оценки степени подверженности человека стрессу, его причин и возможных последствий, включая стрессоустойчивость.',
  'Опросник "Тревожность"':
    'Методика для самооценки как ситуативной (реактивной) тревоги в данный момент, так и личностной (устойчивой) тревожности как черты характера.',
  'Опросник "Суицидальные мысли"':
    'Инструмент для количественной оценки выраженности и силы суицидальных мыслей и намерений, а также пассивного желания умереть.',
};

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTests: TestOption[];
  onSend: (tests: TestOption[]) => void;
  initialSelected: TestOption[];
}

const TestModal: React.FC<TestModalProps> = ({
  isOpen,
  onClose,
  availableTests,
  onSend,
  initialSelected,
}) => {
  const [selectedTests, setSelectedTests] = useState<TestOption[]>(initialSelected);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [menuContainer, setMenuContainer] = useState<HTMLDivElement | undefined>(undefined);

  useEffect(() => {
    // Эта логика выполняется только после первого рендера, когда ref.current уже установлен
    if (modalContentRef.current) {
      setMenuContainer(modalContentRef.current);
    }
  }, [isOpen]);

  const handleChange = (event: SelectChangeEvent<TestOption[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedTests(
      typeof value === 'string' ? (value.split(',') as TestOption[]) : (value as TestOption[]),
    );
  };

  const handleSubmit = () => {
    if (selectedTests.length > 0) {
      onSend(selectedTests);
    } else {
      alert('Пожалуйста, выберите хотя бы один тест.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📋 Выбор тестов для отправки"
      ref={modalContentRef}>
      <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
        <InputLabel id="test-select-label" sx={{ color: '#999' }}>
          Выберите тесты
        </InputLabel>
        <Select
          labelId="test-select-label"
          id="test-select"
          multiple
          value={selectedTests}
          onChange={handleChange}
          input={<OutlinedInput label="Выберите тесты" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={{
            container: menuContainer,
            PaperProps: {
              sx: {
                zIndex: 9999,
                bgcolor: '#282828',
                color: '#e0e0e0',
              },
            },
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888 !important' },
            '.MuiInputBase-input': { color: '#e0e0e0' },
            '.MuiSvgIcon-root': { color: '#e0e0e0' },
          }}>
          {availableTests.map((name) => (
            <MenuItem
              key={name}
              value={name}
              sx={{ '&.Mui-selected': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
              <Checkbox checked={selectedTests.indexOf(name) > -1} sx={{ color: '#e0e0e0' }} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          mt: 2,
          p: 2,
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 1,
          maxHeight: '200px', // Ограничиваем высоту для скролла, если тестов много
          overflowY: 'auto',
        }}>
        <Typography
          variant="subtitle2"
          sx={{ color: '#999', mb: 1, borderBottom: '1px solid #333', pb: 0.5 }}>
          {selectedTests.length > 0
            ? `Выбрано тестов: ${selectedTests.length}`
            : 'Сводная информация:'}
        </Typography>

        {selectedTests.length === 0 ? (
          <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
            Пожалуйста, выберите один или несколько тестов из списка выше.
          </Typography>
        ) : (
          selectedTests.map((testName) => (
            <Box key={testName} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fff' }}>
                {testName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                {/* 💡 Получаем описание по ключу. Если нет, выводим заглушку. */}
                {TEST_DESCRIPTIONS[testName] || 'Описание отсутствует.'}
              </Typography>
            </Box>
          ))
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          Отмена
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={selectedTests.length === 0}>
          Отправить
        </Button>
      </Box>
    </Modal>
  );
};

export default TestModal;
