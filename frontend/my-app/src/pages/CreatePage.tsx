import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  
import CreateCollection from '../Components/CreateCollection';
import CreateFlashcardSet from '../Components/CreateFlashcardSet';
import CreateFlashcard from '../Components/CreateFlashcard';
import { Link } from 'react-router-dom';
import './CreatePage.css';

const CreatePage = () => {
  const [view, setView] = useState<'collection' | 'flashcardSet' | 'flashcard'>('collection');
  const [collections, setCollections] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

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

  const fetchData = async () => {
    if (userId) {
      try {
        const collectionsResponse = await axios.get(`http://localhost:5000/users/${userId}/collections`);
        const flashcardSetsResponse = await axios.get(`http://localhost:5000/users/${userId}/flashcardSets`);
        setCollections(collectionsResponse.data);
        setFlashcardSets(flashcardSetsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    

    <div>
        <nav>
        <ul>
          <li><Link to="/flashcards">View your Flashcard</Link></li>
          <li><Link to="/create">Create Flashcards</Link></li>
          <li><Link to="/browse">Browse Flashcards</Link></li>
          <li><Link to="/">log Out</Link></li>
        </ul>
      </nav>

      <header>
          <h1>Create</h1>
          <p>Select bellow what you wish to make.</p>
      </header>

      <div className="toggle-buttons">
        <button onClick={() => setView('collection')}>Create Collection</button>
        <button onClick={() => setView('flashcardSet')}>Create Flashcard Set</button>
        <button onClick={() => setView('flashcard')}>Create Flashcard</button>
      </div>

      <div className="form-container">
        {view === 'collection' && userId && <CreateCollection userId={userId} refreshCollections={fetchData} />}
        {view === 'flashcardSet' && userId && <CreateFlashcardSet userId={userId} collections={collections} refreshFlashcardSets={fetchData} />}
        {view === 'flashcard' && <CreateFlashcard flashcardSets={flashcardSets} />}
      </div>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 TestVars-Flashcards. All rights reserved.</p>
      </footer>
    </div>
    
    
  );
};

export default CreatePage;
