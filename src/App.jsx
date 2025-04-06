import { useState, useEffect } from 'react';
import './App.css';
import HomeImg from './assets/head_cols.png';
import Header from './components/Header';

function App() {
  const [activeButton, setActiveButton] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="app">
      {/* Background Image */}
      <div className="background-image">
        <img src={HomeImg} alt="TSU Campus" />
      </div>
      
      {/* Diagonal Split */}
      <div className="diagonal-split">
        <div className="blue-triangle">
          {/* Geometric shapes */}
          <div className="shape circle-shape"></div>
          <div className="shape triangle-shape"></div>
          <div className="shape square-shape"></div>
          <div className="shape half-circle-shape"></div>
        </div>
      </div>
      
      {/* Header/Navbar */}
      <Header />

      {/* Main Content */}
      <main className="content">
        <div className="content-left"></div>
        <div className="content-right">
          <div className="text-content">
            <h2>Connect. Serve. Grow.</h2>
            <p>
              TSU Engage is your gateway to campus events, volunteer opportunities, 
              and rewarding experiences. Earn badges, climb leaderboards, and make an impact!
            </p>
            
            <div className="cta-buttons">
              <button 
                className={`primary-btn ${activeButton === 'events' ? 'active' : ''}`}
                onClick={() => setActiveButton('events')}
              >
                View Events
              </button>
              {isAuthenticated && (
                <button 
                  className={`primary-btn ${activeButton === 'volunteer' ? 'active' : ''}`}
                  onClick={() => setActiveButton('volunteer')}
                >
                  Volunteer
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;