import React, { useState, useEffect } from 'react';
import axiosInstance from '../utilities/axiosInstance';
import { Link } from 'react-router-dom';
import './AdminCollections.css';

interface Collection {
  id: number;
  title: string;
}

interface User {
  id: number;
  username: string;
}

const AdminCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axiosInstance.get('/collections');
        setCollections(response.data);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchCollections();
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    if (selectedUserId === null) {
      alert('Please select a user.');
      return;
    }

    try {
      const response = await axiosInstance.post('/collections', { title: newTitle, userId: selectedUserId });
      setCollections([...collections, response.data]);
      setNewTitle('');
      setSelectedUserId(null);
    } catch (error) {
      console.error('Error adding collection:', error);
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setNewTitle(collection.title);
  };

  const handleSave = async () => {
    if (editingCollection) {
      try {
        await axiosInstance.put(`/collections/${editingCollection.id}`, { title: newTitle });
        setCollections(collections.map(collection =>
          collection.id === editingCollection.id ? { ...collection, title: newTitle } : collection
        ));
        setEditingCollection(null);
        setNewTitle('');
      } catch (error) {
        console.error('Error updating collection:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/collections/${id}`);
      setCollections(collections.filter(collection => collection.id !== id));
    } catch (error) {
      console.error('Error deleting collection:', error);
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
      <div className="admin-collections">
        <h2>Admin Collections</h2>
        <div className="fixed-inputs">
          <input
            type="text"
            placeholder="New collection title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <select value={selectedUserId ?? ''} onChange={e => setSelectedUserId(Number(e.target.value))}>
            <option value="" disabled>Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{`ID: ${user.id}, USERNAME: ${user.username}`}</option>
            ))}
          </select>
          <button onClick={editingCollection ? handleSave : handleAdd}>
            {editingCollection ? 'Save' : 'Add New Collection'}
          </button>
        </div>
        <div className="scrollable-content">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(collection => (
                <tr key={collection.id}>
                  <td>{collection.id}</td>
                  <td>
                    {editingCollection && editingCollection.id === collection.id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                      />
                    ) : (
                      collection.title
                    )}
                  </td>
                  <td>
                    {editingCollection && editingCollection.id === collection.id ? (
                      <button onClick={handleSave}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(collection)}>Edit</button>
                        <button onClick={() => handleDelete(collection.id)}>Delete</button>
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

export default AdminCollections;
