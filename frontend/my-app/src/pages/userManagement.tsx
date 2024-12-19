import React from 'react';
import { Link } from 'react-router-dom';

const UserManagementPage: React.FC = () => {
  return (
    <div>
      <h1>User Management</h1>
      <p>Click the above tabs to navigate</p>
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/user/collections">Manage My Collections</Link></li>
          <li><Link to="/user/sets">Manage My Sets</Link></li>
          <li><Link to="/user/flashcards">Manage My Flashcards</Link></li>
          <li><Link to="/">Log Out</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default UserManagementPage;
