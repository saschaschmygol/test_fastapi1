import React from 'react';
import { ModalTable } from './ModalTable';
export type ResultItem = {
  id: number;
  name: string;
  createdAt: number;
  totalScore: number;
  resultMessage: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: ResultItem[];
};

export const ReportModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  return (
    <ModalTable isOpen={isOpen} onClose={onClose} title="Отчет по тестам">
      <div style={{ width: '1000px', maxWidth: '100%' }}>
        <div
          style={{
            maxHeight: '500px',
            overflowY: 'auto',
            marginTop: '12px',
          }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1rem',
              tableLayout: 'fixed',
              border: '1px solid rgba(255,255,255,0.7)', // внешняя рамка
            }}>
            <colgroup>
              <col style={{ width: '80px' }} />
              <col style={{ width: '150px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '70px' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>

            <thead>
              <tr>
                {['ID', 'Тест', 'Дата', 'Балл', 'Расшифровка'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.6rem',
                      border: '1px solid rgba(255,255,255,0.7)',
                      textAlign: 'left',
                      verticalAlign: 'top',
                    }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td style={cellStyle}>{item.id}</td>
                  <td style={cellStyle}>{item.name || '-'}</td>
                  <td style={cellStyle}>{new Date(item.createdAt).toLocaleString()}</td>
                  <td style={cellStyle}>{item.totalScore}</td>
                  <td
                    style={{
                      ...cellStyle,
                      whiteSpace: 'normal',
                      overflowWrap: 'break-word',
                    }}>
                    {item.resultMessage || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModalTable>
  );
};

const cellStyle: React.CSSProperties = {
  padding: '0.6rem',
  border: '1px solid rgba(255,255,255,0.7)', // 🔥 белая сетка
  verticalAlign: 'top', // 🔥 выравнивание по верхнему краю
};
