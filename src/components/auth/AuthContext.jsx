import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');
      
      if (token && storedUserData) {
        try {
          // Add token validation API call if needed
          setIsAuthenticated(true);
          setUserData(JSON.parse(storedUserData));
        } catch (error) {
          console.error('Token validation failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = (authData) => {
    localStorage.setItem('authToken', authData.token);
    const userData = {
      userId: authData.userId,
      email: authData.email,
      userType: authData.userType
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUserData(userData);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('https://localhost:7221/api/Auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUserData(null);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
  
      const response = await fetch('https://localhost:7221/api/Auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userData, 
      loading,
      login, 
      logout ,
      fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);