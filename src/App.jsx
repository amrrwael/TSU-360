import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import './App.css';
import HomeImg from './assets/head_cols.png';
import Header from './components/Header';
import Profile from './components/Profile/Profile';
import { useNavigate } from 'react-router-dom';
import Events from './components/Event/Events';
import EventDetails from './components/Event/EventDetails';


function AppContent() {
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();

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

      {/* Main Content - changes based on route */}
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={
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
                    onClick={() => {
                      setActiveButton("events");
                      navigate("/events");
                    }}
                  >
                    View Events
                  </button>
                </div>
              </div>
            </div>
          </main>
        } />

        {/* Events Page Route */}
        <Route path="/events" element={
          <main className="content">
            <Events />
          </main>
        } />

        {/* Dynamic Event Details Route */}
        <Route path="/events/:eventId" element={
          <main className="content">
            <EventDetails />
          </main>
        } />

        {/* Profile Page Route */}
        <Route path="/profile" element={
          <main className="content">
            <Profile />
          </main>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;