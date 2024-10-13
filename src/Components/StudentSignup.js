import React, { useState } from 'react';
import './LoginStyle.css'; // Ensure this CSS file is being imported

const StudentSignup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('https://gps-backend-2.onrender.com/api/accounts/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role: 'student' }),
    });

    if (response.ok) {
      // Handle successful registration (e.g., navigate to login)
      console.log('Registration successful!');
      alert('Registration successful!');
    // Navigate to the login page
    window.location.href = '/student/login';

    } else {
      setError('Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h1>Student Signup</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Roll No:</label>
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
        <button className="LoginButton" type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Already have an account? <a href="/student/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default StudentSignup;
