import React, { useState } from 'react';
import axios from 'axios';

interface Collection {
  id: number;
  title: string;
}

interface CreateFlashcardSetProps {
  userId: number;
  collections: Collection[];
  refreshFlashcardSets: () => void;
}

//component to take user inputs and create a new flashcard set
const CreateFlashcardSet: React.FC<CreateFlashcardSetProps> = ({ userId, collections, refreshFlashcardSets }) => {
  const [name, setName] = useState('');
  const [collectionId, setCollectionId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/sets', { name, userId, flashcards: [], collections: [{ id: collectionId }] });
      setSuccess('Flashcard set created successfully!');
      setName('');
      setCollectionId(null);
      refreshFlashcardSets(); // Fetch updated flashcard sets
    } catch (error: any) {
      console.error('Error creating flashcard set:', error); 
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); 
      } else {
        setError('Failed to create flashcard set.'); 
      }
    }
    
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Collection:</label>
        <select value={collectionId || ''} onChange={(e) => setCollectionId(Number(e.target.value))} required>
          <option value="" disabled>Select a collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>{collection.title}</option>
          ))}
        </select>
      </div>
      <button type="submit">Create Flashcard Set</button>
      {success && <p>{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default CreateFlashcardSet;
