import React, { useState } from 'react';
import axiosInstance from '../utilities/axiosInstance';
import './LoginPage.css';

interface LoginFormState {
  username: string;
  password: string;
  error: string;
}

const LoginPage: React.FC = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    username: '',
    password: '',
    error: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, password } = formState;

    if (!username || !password) {
      setFormState({
        ...formState,
        error: 'Please fill out both fields.',
      });
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Call backend to decode the JWT token and get user info
      const decodeResponse = await axiosInstance.post('/auth/decode-token', { token });
      const decodedToken = decodeResponse.data;

      if (decodedToken) {
        if (decodedToken.admin) {
          localStorage.setItem('isAdmin', 'true');
          window.location.href = '/admin-dashboard'; // Redirect to admin dashboard if user is an admin
        } else {
          localStorage.setItem('isAdmin', 'false');
          window.location.href = '/home'; // Redirect to home page if user is not an admin
        }
      }
    } catch (error) {
      setFormState({
        ...formState,
        error: 'Invalid credentials. Please try again.',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState({
      ...formState,
      [id]: value,
    });
  };

  return (
    <div>
      <h1>TESTVARS FLASHCARDS</h1>
      <img src="/logo2.jpg" alt="company logo" className="company-logo" />
      <div className="login-container">
        <div className="logo-container"></div>
        <div className="login-box">
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formState.username}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
              />
            </div>
            {formState.error && <p className="error-message">{formState.error}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
