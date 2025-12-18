import React, { forwardRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, children, title }, ref) => {
    if (!isOpen) {
      return null;
    }

    const backdropStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
    };

    const modalContentStyle: React.CSSProperties = {
      backgroundColor: '#1e1e1e',
      padding: '30px',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.8)',
      position: 'relative',
      color: '#e0e0e0',
    };

    const closeButtonStyle: React.CSSProperties = {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#e0e0e0',
      lineHeight: '1',
    };

    return (
      <div style={backdropStyle} onClick={onClose}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()} ref={ref}>
          <button style={closeButtonStyle} onClick={onClose}>
            &times;
          </button>
          <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: '0' }}>
            {title}
          </h3>
          {children}
        </div>
      </div>
    );
  },
);

export default Modal;
