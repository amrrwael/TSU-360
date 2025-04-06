import React, { useState } from 'react';
import './Header.css';
import Logo from '../assets/Logo.png';
import AuthModal from './auth/AuthModal';

const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleAuthSuccess = (authData) => {
    // Store the token in localStorage
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('userData', JSON.stringify({
      userId: authData.userId,
      email: authData.email,
      userType: authData.userType
    }));
    
    // You can redirect or update UI state here
    window.location.reload(); // Simple refresh for demo
  };

  return (
    <>
      <header className="header">
        <div className="Whole">
          <div className="left-side">
            <div className="logo">
              <img src={Logo} alt="TSU Campus" />
              <h1>TSU 360</h1>
            </div>
          </div>

          <div className="right-side">
            <button 
              className="auth-btn signup-btn"
              onClick={() => {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
            >
              Sign Up
            </button>
            <button 
              className="auth-btn login-btn"
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
            >
              Log In
            </button>
            <button className="profile-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {authModalOpen && (
        <AuthModal 
          mode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

export default Header;