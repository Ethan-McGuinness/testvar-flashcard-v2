import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // React Router hook to get URL parameters
import './ViewSet.css';

const ViewFlashcards = () => {
  // Get 'setId' from the URL
  const { setId } = useParams<{ setId: string }>(); // The 'setId' will be available here
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If there's no setId, show an error
    if (!setId) {
      setError('Set ID is required');
      return;
    }

    const fetchFlashcards = async () => {
      try {
        // Make the API request using the setId from the URL
        const response = await axios.get(`http://localhost:5000/sets/${setId}/cards`);
        setFlashcards(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error retrieving flashcards');
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [setId]); // Runs whenever 'setId' changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="view-set">
      {/* Header */}
      <header>
        <h1>Flashcards in Set {setId}</h1>
      </header>

      {/* Flashcard List */}
      <ul className="flashcard-list">
        {flashcards.length > 0 ? (
          flashcards.map((flashcard: any) => (
            <li key={flashcard.id} className="flashcard">
              <h3>Question: {flashcard.question}</h3>
              <p>Answer: {flashcard.answer}</p>
              <p>Difficulty: {flashcard.difficulty}</p>
            </li>
          ))
        ) : (
          <p>No flashcards found.</p>
        )}
      </ul>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 TestVars-Flashcards. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewFlashcards;
