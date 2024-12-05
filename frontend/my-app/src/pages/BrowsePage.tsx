import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/sideBar';
import { copyCollectionToUser, copyFlashcardSetToUser, copyFlashcardToUser } from '../utilities/addToUser';

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
  flashcards: Flashcard[];
}

interface Collection {
  id: number;
  title: string;
  flashcardSets: FlashcardSet[];
}

const BrowsePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('flashcards');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

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

  const handleCopyFlashcard = async (flashcardId: number, userId: number, flashcardSetId: number) => {
    await copyFlashcardToUser(flashcardId, userId, flashcardSetId);
  };

  const handleCopySet = async (setId: number, userId: number, collectionId: number) => {
    await copyFlashcardSetToUser(setId, userId, collectionId);
  };

  const handleCopyCollection = async (collectionId: number, userId: number) => {
    await copyCollectionToUser(collectionId, userId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Browse Public Flashcards</h1>
      <h2>Flashcards</h2>
      <ul>
        {flashcards.map((flashcard) => (
          <li key={flashcard.id}>
            {flashcard.question}
            <button onClick={() => handleCopyFlashcard(flashcard.id, 1, 1)}>Copy to My Set</button>
          </li>
        ))}
      </ul>
      <h2>Flashcard Sets</h2>
      <ul>
        {sets.map((set) => (
          <li key={set.id}>
            {set.name}
            <button onClick={() => handleCopySet(set.id, 1, 1)}>Copy to My Collection</button>
          </li>
        ))}
      </ul>
      <h2>Collections</h2>
      <ul>
        {collections.map((collection) => (
          <li key={collection.id}>
            {collection.title}
            <button onClick={() => handleCopyCollection(collection.id, 1)}>Copy to My Account</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrowsePage;
