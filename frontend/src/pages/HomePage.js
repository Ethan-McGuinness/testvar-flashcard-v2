import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate an API call to get user data using the token
    const token = localStorage.getItem('token');
    if (token) {
      // This could be an API request, but here we just mock it
      setUser({ username: 'Test User', admin: true }); // Mock user data
    }
  }, []);

  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      {user ? (
        <p>Welcome, {user.username}. {user.admin && 'You are an admin.'}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HomePage;
