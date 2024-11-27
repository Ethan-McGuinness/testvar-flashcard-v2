import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Correct import
import { Link } from 'react-router-dom';
import './ViewFlashcards.css';

const ViewFlashcards: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);  // State to store userId
  const [collections, setCollections] = useState<any[]>([]);  // State to store collections
  const [expandedCollection, setExpandedCollection] = useState<number | null>(null); // Track the expanded collection

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the token and get the userId
        const decodedToken: any = jwtDecode(token);  // Decoding the token
        setUserId(decodedToken.userId);  // Store the userId from the token
      } catch (error) {
        console.error("Failed to decode the token", error);
      }
    }
  }, []);  // Empty dependency array means this runs once when the component mounts

  // Fetch collections based on the userId (we'll use this later)
  useEffect(() => {
    if (userId) {
      // Fetch collections from the backend
      fetch(`http://localhost:5000/users/${userId}/collections`)
        .then((response) => response.json())
        .then((data) => {
          setCollections(data);  // Set the collections once we get the data
        })
        .catch((error) => console.error('Error fetching collections:', error));
    }
  }, [userId]);  // This runs whenever userId changes

  // Toggle the visibility of flashcards for a collection
  const toggleCollection = (collectionId: number) => {
    setExpandedCollection(prev => prev === collectionId ? null : collectionId);
  };

  return (
    <div className="view-flashcards">
      {/* Navbar */}
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/create">Create Flashcards</Link></li>
          <li><Link to="/">Log Out</Link></li>
        </ul>
      </nav>

      {/* Header */}
      <header>
        <h1>View Collections</h1>
        <p>Explore flashcards sets by collection and set.</p>
      </header>

      {/* Categories and Collections Section */}
      <main>
        {collections.length > 0 ? (
          collections.map((collection, index) => (
            <div className="collection" key={index}>
              <h2 onClick={() => toggleCollection(collection.id)} style={{ cursor: 'pointer' }}>
                {collection.title}
              </h2>

              {/* Show flashcards only when the collection is expanded */}
              {expandedCollection === collection.id && (
                <ul>
                  {collection.flashcardSets.map((set: any, idx: number) => (
                    <li key={idx}>
                      <Link to={`/sets/${set.id}/cards`}>
                        {set.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p>Loading collections...</p>
        )}
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 TestVars-Flashcards. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewFlashcards;
