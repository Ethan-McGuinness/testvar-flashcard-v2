import React, { useEffect, useState } from 'react';

// Define an interface for the user data structure
interface User {
  username: string;
  admin: boolean;
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // User can be of type User or null

  useEffect(() => {
    // Simulate an API call to get user data using the token
    const token = localStorage.getItem('token');
    if (token) {
      // This could be an API request, but here we just mock it
      setUser({ username: 'Test User', admin: true }); // Mock user data
    }
  }, []); // Empty dependency array ensures it runs once when the component mounts

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
