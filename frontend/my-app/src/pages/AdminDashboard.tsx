import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Click the above tabs to navigate</p>
      <nav>
        <ul>
          <li><Link to="/admin/collections">Manage Collections</Link></li>
          <li><Link to="/admin/sets">Manage Sets</Link></li>
          <li><Link to="/admin/flashcards">Manage Flashcards</Link></li>
          <li><Link to="/admin/users">Manage Users</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
