import React, { useState } from 'react';

const ResetPassword = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    const response = await fetch('https://gps-backend-2.onrender.com/api/accounts/reset-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll_number: rollNumber, otp, new_password: newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Password reset successful!');
    } else {
      setMessage(data.error || 'Something went wrong!');
    }
  };

  return (
    <div className="form-container">
      <h1>Reset Password</h1>
      <form className="reset-form" onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
        <div className="form-group">
          <label htmlFor="rollNumber">Roll No:</label>
          <input
            type="text"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="otp">OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
