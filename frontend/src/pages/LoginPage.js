import React, { useState } from 'react';
import axiosInstance from '../utilities/axiosInstance.Js';
import './LoginPage.css'; // We will create this CSS file for styling

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('http://localhost:5000/auth/login', {
        username,
        password,
      });

      // If login is successful, save token and redirect
      localStorage.setItem('token', response.data.token);
      window.location.href = '/home'; // Redirect to the home page
    } catch (error) {
      console.log("error caught: ", error);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
    <h1>TESTVARS FLASHCARDS</h1>
    <img src="../src/logo2.jpg" alt="company logo" className="company-logo" />
    <div className="login-container">
      <div className="logo-container">
      </div>
      <div className="login-box">
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
