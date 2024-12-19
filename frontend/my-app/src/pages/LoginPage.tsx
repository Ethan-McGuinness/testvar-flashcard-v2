import React, { useState } from 'react';
import axiosInstance from '../utilities/axiosInstance';
import './LoginPage.css';

interface LoginFormState {
  username: string;
  password: string;
  confirmPassword?: string;  // Added for registration
  error: string;
}

const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);  // Toggle state
  const [formState, setFormState] = useState<LoginFormState>({
    username: '',
    password: '',
    confirmPassword: '',
    error: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, password, confirmPassword } = formState;

    if (!username || !password || (isRegistering && !confirmPassword)) {
      setFormState({
        ...formState,
        error: 'Please fill out all fields.',
      });
      return;
    }

    if (isRegistering) {
      if (password !== confirmPassword) {
        setFormState({
          ...formState,
          error: 'Passwords do not match.',
        });
        return;
      }

      try {
        await axiosInstance.post('/users', { username, password });
        setIsRegistering(false);  // Switch to login view after successful registration
      } catch (error) {
        setFormState({
          ...formState,
          error: 'Registration failed. Please try again.',
        });
      }
    } else {
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
            window.location.href = '/admin-dashboard';  // Redirect to admin dashboard if user is an admin
          } else {
            localStorage.setItem('isAdmin', 'false');
            window.location.href = '/home';  // Redirect to home page if user is not an admin
          }
        }
      } catch (error) {
        setFormState({
          ...formState,
          error: 'Invalid credentials. Please try again.',
        });
      }
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

      <div className="login-container">
        <div className="logo-container"></div>
        <div className="login-box">
          <h1>{isRegistering ? 'REGISTER' : 'LOGIN'}</h1>
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
            {isRegistering && (
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formState.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            )}
            {formState.error && <p className="error-message">{formState.error}</p>}
            <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
          </form>
          <p>
            {isRegistering ? (
              <>Already have an account? <button onClick={() => setIsRegistering(false)}>Login here</button></>
            ) : (
              <>Register Here! <button onClick={() => setIsRegistering(true)}>Create Account</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
