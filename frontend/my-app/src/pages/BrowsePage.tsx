import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/sideBar'; // Ensure correct import path
import { copyCollectionToUser, copyFlashcardSetToUser, copyFlashcardToUser } from '../utilities/addToUser';
import '../pages/BrowsePage.css'; // Ensure correct CSS import path
import { Link } from 'react-router-dom';

// Define types for flashcards, sets, and collections
interface Flashcard {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
}

interface FlashcardSet {
  id: number;
  name: string;
}

interface Collection {
  id: number;
  title: string;
  flashcardSets: FlashcardSet[];
}

interface FlashcardSetWithCards extends FlashcardSet {
  flashcards: Flashcard[];
}

const BrowsePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('flashcards');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [selectedSetFlashcards, setSelectedSetFlashcards] = useState<Flashcard[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedCollectionSets, setSelectedCollectionSets] = useState<FlashcardSetWithCards[]>([]);
  const [showCopyOverlay, setShowCopyOverlay] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flashcardResponse = await axios.get<Flashcard[]>('http://localhost:5000/public-flashcards');
        setFlashcards(flashcardResponse.data);

        const setResponse = await axios.get<FlashcardSet[]>('http://localhost:5000/public-sets');
        setSets(setResponse.data);

        const collectionResponse = await axios.get<Collection[]>('http://localhost:5000/public-collections');
        setCollections(collectionResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching public data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchFlashcardsInSet = async (setId: number) => {
    try {
      const response = await axios.get<Flashcard[]>(`http://localhost:5000/sets/${setId}/cards`);
      console.log("Fetched Flashcards for Set:", JSON.stringify(response.data, null, 2)); // Debug log for flashcards
      return response.data;
    } catch (error) {
      console.error(`Error fetching flashcards for set ${setId}:`, error);
      return [];
    }
  };

  const fetchSetsInCollection = async (collectionId: number) => {
    try {
      const response = await axios.get<FlashcardSet[]>(`http://localhost:5000/collections/${collectionId}/sets`);
      console.log("Fetched Sets for Collection:", JSON.stringify(response.data, null, 2)); // Debug log for sets in collection
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching sets for collection ${collectionId}:`, error);
      return [];
    }
  };

  const handleSelectCollection = async (collection: Collection) => {
    console.log("Selected Collection:", JSON.stringify(collection, null, 2)); // Debug log for selected collection
  
    try {
      const sets = await fetchSetsInCollection(collection.id);
  
      if (sets.length === 0) {
        console.error("No flashcard sets available in this collection.");
        return;
      }
  
      setSelectedCollection({ ...collection, flashcardSets: sets });
    } catch (error) {
      console.error("Error selecting collection:", error);
    }
  };
  
  

  const handleSelectSetInCollection = async (set: FlashcardSetWithCards) => {
    setSelectedSet(set);
    setSelectedSetFlashcards(set.flashcards);
  };

  const handleCopyFlashcard = async (flashcardId: number, userId: number, flashcardSetId: number) => {
    setShowCopyOverlay(true);
  };

  const handleCopySet = async (setId: number, userId: number, collectionId: number) => {
    setShowCopyOverlay(true);
  };

  const handleCopyCollection = async (collectionId: number, userId: number) => {
    setShowCopyOverlay(true);
  };

  const closeOverlay = () => {
    setShowCopyOverlay(false);
  };

  

  const renderFlashcards = () => (
    <div>
      <h2>Public Flashcards</h2>
      <ul>
        {flashcards.map((flashcard) => (
          <li key={flashcard.id}>
            <p><strong>Question:</strong> {flashcard.question}</p>
            <p><strong>Answer:</strong> {flashcard.answer}</p>
            <p><strong>Difficulty:</strong> {flashcard.difficulty}</p>
            <button onClick={() => handleCopyFlashcard(flashcard.id, 1, 1)}>Copy to My Set</button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSets = () => (
    <div>
      <h2>Public Sets - Click on a set to view its content</h2>
      <ul>
        {sets.map((set) => (
          <li key={set.id} onClick={() => {
            console.log("Selected Set:", JSON.stringify(set, null, 2)); // Debug the selected set
            setSelectedSet(set);
            fetchFlashcardsInSet(set.id).then(setSelectedSetFlashcards); // Fetch flashcards for the selected set
          }}>
            {set.name}
            <button onClick={() => handleCopySet(set.id, 1, 1)}>Copy to My Collection</button>
          </li>
        ))}
      </ul>
      {selectedSet && (
        <div className="overlay">
          <button className="close" onClick={() => setSelectedSet(null)}>Close</button>
          <h3>{selectedSet.name}</h3>
          <ul>
            {selectedSetFlashcards.length > 0 ? (
              selectedSetFlashcards.map((flashcard) => (
                <li key={flashcard.id}>
                  <p><strong>Question:</strong> {flashcard.question}</p>
                  <p><strong>Answer:</strong> {flashcard.answer}</p>
                  <p><strong>Difficulty:</strong> {flashcard.difficulty}</p>
                  <button onClick={() => handleCopyFlashcard(flashcard.id, 1, selectedSet.id)}>Copy to My Set</button>
                </li>
              ))
            ) : (
              <p>No flashcards available for this set.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );

  const renderCollections = () => (
    <div>
      <h2>Public Collections - click on a collection & set to view its content</h2>
      <ul>
        {collections.map((collection) => (
          <li key={collection.id} onClick={() => handleSelectCollection(collection)}>
            {collection.title}
            <button onClick={() => handleCopyCollection(collection.id, 1)}>Copy to My Account</button>
          </li>
        ))}
      </ul>
      {selectedCollection && (
        <div className="overlay">
          <button className="close" onClick={() => setSelectedCollection(null)}>Close</button>
          <h3>{selectedCollection.title}</h3>
          <ul>
            {selectedCollection.flashcardSets.map((set) => (
              <li key={set.id} onClick={async () => {
                console.log("Selected Set in Collection:", JSON.stringify(set, null, 2)); // Debug log for selected set in collection
                setSelectedSet(set);
                const flashcards = await fetchFlashcardsInSet(set.id);
                setSelectedSetFlashcards(flashcards);
              }}>
                <h4>{set.name}</h4>
                <button onClick={() => handleCopySet(set.id, 1, selectedCollection.id)}>Copy to My Collection</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedSet && (
        <div className="overlay">
          <button className="close" onClick={() => setSelectedSet(null)}>Close</button>
          <h3>{selectedSet.name}</h3>
          <ul>
            {selectedSetFlashcards.length > 0 ? (
              selectedSetFlashcards.map((flashcard) => (
                <li key={flashcard.id}>
                  <p><strong>Question:</strong> {flashcard.question}</p>
                  <p><strong>Answer:</strong> {flashcard.answer}</p>
                  <p><strong>Difficulty:</strong> {flashcard.difficulty}</p>
                  <button onClick={() => handleCopyFlashcard(flashcard.id, 1, selectedSet.id)}>Copy to My Set</button>
                </li>
              ))
            ) : (
              <p>No flashcards available for this set.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
  
  
  
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="browse-page">
      <nav>
        <ul>
          <li><Link to="/flashcards">View your Flashcard</Link></li>
          <li><Link to="/create">Create Flashcards</Link></li>
          <li><Link to="/browse">Browse Flashcards</Link></li>
          <li><Link to="/">log Out</Link></li>
        </ul>
      </nav>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="content">
        {activeTab === 'flashcards' && renderFlashcards()}
        {activeTab === 'sets' && renderSets()}
        {activeTab === 'collections' && renderCollections()}
      </div>
      <footer>
        <p>&copy; 2024 TestVars-Flashcards. All rights reserved.</p>
      </footer>

      {showCopyOverlay && (
        <div className='overlay'>
          <p>Ability to copy will be added in future renditions</p>
          <button onClick={closeOverlay}>Close</button>
          </div>
      )}
    </div>
  );
  
};

export default BrowsePage;
