import React, { useContext } from 'react';
import { NewsletterContext } from '../../context/NewsletterContext';

const TestNewsletterButton = () => {
  const { setShowPopup, resetPopupState } = useContext(NewsletterContext);

  // Only show this in development mode
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '15px',
      right: '15px',
      zIndex: 99,
      display: 'flex',
      gap: '10px'
    }}>
      <button
        onClick={() => setShowPopup(true)}
        style={{
          background: '#333',
          color: 'white',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Show Popup
      </button>
      <button
        onClick={resetPopupState}
        style={{
          background: '#666',
          color: 'white',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Reset State
      </button>
    </div>
  );
};

export default TestNewsletterButton;