import React from 'react'
import './LoginStyle.css'
const AdminLogin = () => {
  return (
    <div className="form-container">
    <h1>Admin Login </h1>
    <form className="login-form">
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
      </div>
      <button className='LoginButton' type="submit">Login</button>
    </form>
  </div>
  )
}

export default AdminLogin