import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NewsletterProvider } from './context/NewsletterContext';
import { ReferralProvider } from './context/ReferralContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <NewsletterProvider>
          <ReferralProvider>
            <App />
          </ReferralProvider>
        </NewsletterProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);