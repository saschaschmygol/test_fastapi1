import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const ModalTable: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}>
      <div
        style={{
          backgroundColor: 'var(--modal-bg, #1a1a1a)',
          padding: '1.5rem',
          borderRadius: '12px',
          minWidth: '480px',
          maxWidth: '800px',
          boxShadow: '0 0 25px rgba(0,0,0,0.5)',
          color: 'rgba(255,255,255,0.87)',
          border: '1px solid rgba(255,255,255,0.1)',
          minHeight: '500px',
          maxHeight: '800px',
        }}
        onClick={(e) => e.stopPropagation()}>
        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: '0' }}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
};
