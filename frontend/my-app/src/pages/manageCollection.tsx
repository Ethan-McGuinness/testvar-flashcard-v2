import React, { useState, useEffect } from 'react';
import axiosInstance from '../utilities/axiosInstance';
import {jwtDecode} from 'jwt-decode';
import { Link } from 'react-router-dom';
import './AdminCollections.css'; 

interface Collection {
  id: number;
  title: string;
}

const UserCollections: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

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

    fetchCollections();
  }, [userId]);

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userId;

      try {
        const response = await axiosInstance.post('/collections', { title: newTitle, userId });
        setCollections([...collections, response.data]);
        setNewTitle('');
      } catch (error) {
        console.error('Error adding collection:', error);
      }
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
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/user/collections">Manage My Collections</Link></li>
          <li><Link to="/user/sets">Manage My Sets</Link></li>
          <li><Link to="/user/flashcards">Manage My Flashcards</Link></li>
          <li><Link to="/">Log Out</Link></li>
        </ul>
      </nav>
      <div className="user-collections">
        <h2>My Collections</h2>
        <div className="fixed-inputs">
          <input
            type="text"
            placeholder="New collection title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
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

export default UserCollections;
