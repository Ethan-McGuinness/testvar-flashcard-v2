import React, { useState, useEffect } from 'react';
import axiosInstance from '../utilities/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import './AdminSets.css'; 

interface Set {
  id: number;
  name: string;
}

interface Collection {
  id: number;
  title: string;
}

const UserSets: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [sets, setSets] = useState<Set[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingSet, setEditingSet] = useState<Set | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); 
        setUserId(decodedToken.userId); 
      } catch (error) {
        console.error("Failed to decode the token", error);
      }
    }

    const fetchSets = async () => {
      if (userId) {
        try {
          const response = await axiosInstance.get(`/users/${userId}/flashcardSets`);
          setSets(response.data);
        } catch (error) {
          console.error('Error fetching sets:', error);
        }
      }
    };

    const fetchCollections = async () => {
      if (userId) {
        try {
          const response = await axiosInstance.get(`/users/${userId}/collections`);
          setCollections(response.data);
        } catch (error) {
          console.error('Error fetching collections:', error);
        }
      }
    };

    fetchSets();
    fetchCollections();
  }, [userId]);

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userId;

      if (selectedCollectionId === null) {
        alert('Please select a collection.');
        return;
      }

      try {
        const response = await axiosInstance.post('/sets', { name: newTitle, userId, flashcards: [], collections: [{ id: selectedCollectionId }] });
        setSets([...sets, response.data]);
        setNewTitle('');
        setSelectedCollectionId(null);
      } catch (error) {
        console.error('Error adding set:', error);
      }
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
            <li><Link to="/home">Home</Link></li>
          <li><Link to="/user/collections">Manage My Collections</Link></li>
          <li><Link to="/user/sets">Manage My Sets</Link></li>
          <li><Link to="/user/flashcards">Manage My Flashcards</Link></li>
          <li><Link to="/">Log Out</Link></li>
        </ul>
      </nav>
      <div className="user-sets">
        <h2>My Sets</h2>
        <div className="fixed-inputs">
          <input
            type="text"
            placeholder="New set title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
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

export default UserSets;
