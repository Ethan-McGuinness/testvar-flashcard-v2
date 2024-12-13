import React, { useState, useEffect } from 'react';
import axiosInstance from '../utilities/axiosInstance';
import { Link } from 'react-router-dom';
import './AdminUsers.css';

interface User {
  id: number;
  username: string;
  password?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAdd = async () => {
    if (!newUsername || !newPassword) {
      alert('Please enter username and password.');
      return;
    }

    try {
      const response = await axiosInstance.post('/users', { username: newUsername, password: newPassword });
      setUsers([...users, response.data]);
      setNewUsername('');
      setNewPassword('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewUsername(user.username);
  };

  const handleSave = async () => {
    if (editingUser) {
      try {
        await axiosInstance.put(`/users/${editingUser.id}`, { username: newUsername, password: newPassword || undefined });
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, username: newUsername } : user
        ));
        setEditingUser(null);
        setNewUsername('');
        setNewPassword('');
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li><Link to="/admin/collections">Manage Collections</Link></li>
          <li><Link to="/admin/sets">Manage Sets</Link></li>
          <li><Link to="/admin/flashcards">Manage Flashcards</Link></li>
          <li><Link to="/admin/users">Manage Users</Link></li>
        </ul>
      </nav>
      <div className="admin-users">
        <h2>Admin Users</h2>
        <div className="fixed-inputs">
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <button onClick={editingUser ? handleSave : handleAdd}>
            {editingUser ? 'Save' : 'Add New User'}
          </button>
        </div>
        <div className="scrollable-content">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {editingUser && editingUser.id === user.id ? (
                      <input
                        type="text"
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser.id === user.id ? (
                      <button onClick={handleSave}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
