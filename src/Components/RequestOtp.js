import React, { useState } from 'react';

const RequestOtp = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestOtp = async () => {
    const response = await fetch('https://gps-backend-2.onrender.com/api/accounts/request-reset-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll_number: rollNumber }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('OTP sent to your email!');
    } else {
      setMessage(data.error || 'Something went wrong!');
    }
  };

  return (
    <div className="form-container">
      <h1>Request Password Reset OTP</h1>
      <form className="otp-form" onSubmit={(e) => { e.preventDefault(); handleRequestOtp(); }}>
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
        <button type="submit">Request OTP</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default RequestOtp;
