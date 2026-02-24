import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EventList from './components/Events/EventList';
import NotificationPanel from './components/Notifications/NotificationPanel';
import { connectSocket, disconnectSocket } from './services/socket';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = connectSocket();
    setSocket(s);
    return () => disconnectSocket();
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">🎫</span>
          <h1>Event Management Platform</h1>
        </div>
        <div className="header-actions">
          {socket && <NotificationPanel socket={socket} />}
          {user ? (
            <div className="user-info">
              <span>Welcome, <strong>{user.username}</strong></span>
              <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-secondary" onClick={() => setAuthView('login')}>Sign In</button>
              <button onClick={() => setAuthView('register')}>Register</button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {!user && (
          <div className="auth-section">
            {authView === 'login' ? (
              <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />
            ) : (
              <Register onLogin={handleLogin} onSwitchToLogin={() => setAuthView('login')} />
            )}
          </div>
        )}
        <EventList currentUser={user} socket={socket} />
      </main>
    </div>
  );
}

export default App;
