import { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ mode, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthday: '',
    faculty: 0,
    year: 1,
    degree: 0
  });
  const [error, setError] = useState('');

  const faculties = [
    'SoftwareEngineering',
    'Science',
    'Engineering',
    'Medicine',
    'Arts',
    'Business',
    'Law',
    'Other'
  ];

  const degrees = [
    'Bachelor',
    'Master',
    'PhD'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'faculty' || name === 'degree' || name === 'year' 
        ? parseInt(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const url = isLogin 
        ? 'https://localhost:7221/api/Auth/login' 
        : 'http://localhost:7221/api/auth/register';
      
      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password
          }
        : formData;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      onAuthSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Log in to continue' : 'Join our community'}</p>
        </div>
        
        {error && <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              minLength="8"
            />
          </div>
          
          {!isLogin && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Faculty</label>
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select faculty</option>
                    {faculties.map((faculty, index) => (
                      <option key={faculty} value={index}>{faculty}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Degree</label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select degree</option>
                    {degrees.map((degree, index) => (
                      <option key={degree} value={index}>{degree}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Year of Study</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  placeholder="1-5"
                  required
                />
              </div>
            </>
          )}
          
          <button type="submit" className="submit-btn">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? ' Sign up' : ' Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;