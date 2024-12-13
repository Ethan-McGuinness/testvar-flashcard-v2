import React, { useState, useEffect } from 'react';
import axiosInstance from '../utilities/axiosInstance';
import { Link } from 'react-router-dom';
import './AdminSets.css';

interface Set {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
}

interface Collection {
  id: number;
  title: string;
}

const AdminSets: React.FC = () => {
  const [sets, setSets] = useState<Set[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingSet, setEditingSet] = useState<Set | null>(null);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axiosInstance.get('/sets');
        setSets(response.data);
      } catch (error) {
        console.error('Error fetching sets:', error);
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

    const fetchCollections = async () => {
      try {
        const response = await axiosInstance.get('/collections');
        setCollections(response.data);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchSets();
    fetchUsers();
    fetchCollections();
  }, []);

  const handleAdd = async () => {
    if (selectedUserId === null || selectedCollectionId === null) {
      alert('Please select a user and a collection.');
      return;
    }

    try {
      const response = await axiosInstance.post('/sets', { name: newTitle, userId: selectedUserId, flashcards: [], collections: [{ id: selectedCollectionId }] });
      setSets([...sets, response.data]);
      setNewTitle('');
      setSelectedUserId(null);
      setSelectedCollectionId(null);
    } catch (error) {
      console.error('Error adding set:', error);
    }
  };

  const handleEdit = (set: Set) => {
    setEditingSet(set);
    setNewTitle(set.name);
  };

  const handleSave = async () => {
    if (editingSet) {
      try {
        await axiosInstance.put(`/sets/${editingSet.id}`, { name: newTitle });
        setSets(sets.map(set => 
          set.id === editingSet.id ? { ...set, name: newTitle } : set
        ));
        setEditingSet(null);
        setNewTitle('');
      } catch (error) {
        console.error('Error updating set:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/sets/${id}`);
      setSets(sets.filter(set => set.id !== id));
    } catch (error) {
      console.error('Error deleting set:', error);
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
      <div className="admin-sets">
        <h2>Admin Sets</h2>
        <div className="fixed-inputs">
          <input
            type="text"
            placeholder="New set title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <select value={selectedUserId ?? ''} onChange={e => setSelectedUserId(Number(e.target.value))}>
            <option value="" disabled>Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{`ID: ${user.id}, USERNAME: ${user.username}`}</option>
            ))}
          </select>
          <select value={selectedCollectionId ?? ''} onChange={e => setSelectedCollectionId(Number(e.target.value))}>
            <option value="" disabled>Select a collection</option>
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>{collection.title}</option>
            ))}
          </select>
          <button onClick={editingSet ? handleSave : handleAdd}>
            {editingSet ? 'Save' : 'Add New Set'}
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
              {sets.map(set => (
                <tr key={set.id}>
                  <td>{set.id}</td>
                  <td>
                    {editingSet && editingSet.id === set.id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                      />
                    ) : (
                      set.name
                    )}
                  </td>
                  <td>
                    {editingSet && editingSet.id === set.id ? (
                      <button onClick={handleSave}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(set)}>Edit</button>
                        <button onClick={() => handleDelete(set.id)}>Delete</button>
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

export default AdminSets;
