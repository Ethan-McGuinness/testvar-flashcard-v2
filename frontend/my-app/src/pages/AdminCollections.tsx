import React, { useState, useEffect } from 'react';
import axiosInstance from '../utilities/axiosInstance';

interface Collection {
  id: number;
  name: string;
}

const AdminCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axiosInstance.get('/collections');
        setCollections(response.data);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div>
      <h2>Admin Collections</h2>
      <button onClick={() => {/* Add functionality to add new collection */}}>
        Add New Collection
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map(collection => (
            <tr key={collection.id}>
              <td>{collection.id}</td>
              <td>{collection.name}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCollections;
