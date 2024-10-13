import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginStyle.css';

const StaffLogin = ({ login }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('https://gps-backend-2.onrender.com/api/accounts/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      login(data.token, 'staff');
      localStorage.setItem('username', username);
      navigate('/staff');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="form-container">
      <h1>Staff Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Staff Id:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="LoginButton" type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Don't have an account? <a href="/staff/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default StaffLogin;
