import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewSet.css';
import { Link } from 'react-router-dom';

const ViewSet = () => {
  const { setId } = useParams<{ setId: string }>();
  const [setName, setSetName] = useState<string>(''); // Store the set name
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0); // Track the current card
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]); // Track flipped state for each card

  // Fetch the set details
  useEffect(() => {
    if (!setId) return;

    // Fetch the set details by setId to get the set name
    const fetchSetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sets/${setId}`);
        setSetName(response.data.name); // Set the name
      } catch (error) {
        setError('Error retrieving set details');
        setLoading(false);
      }
    };
    fetchSetDetails();
  }, [setId]);

  // Fetch the flashcards for the set
  useEffect(() => {
    if (!setId) return;

    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sets/${setId}/cards`);
        setFlashcards(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error retrieving flashcards');
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [setId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Handle the card flip (show answer or not)
  const handleFlipCard = () => {
    setFlippedCards(prev => {
      const newFlippedCards = [...prev];
      newFlippedCards[currentCardIndex] = !newFlippedCards[currentCardIndex];
      return newFlippedCards;
    });
  };

  // Handle navigation to next card
  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  // Handle navigation to previous card
  const previousCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="view-set">

      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/create">Create Flashcards</Link></li>
          <li><Link to="/">Log Out</Link></li>
        </ul>
      </nav>

      {/* Header */}
      <header>
        <h1>{setName}</h1>
      </header>

      {/* Flashcard Section */}
      <div className="flashcard-container">
        <div
          className={`flashcard ${flippedCards[currentCardIndex] ? 'flipped' : ''}`}
          onClick={handleFlipCard}
        >
          {/* Front of the card */}
          <div className="flashcard-front">
            <div className="question">{flashcards[currentCardIndex]?.question}</div>
            <div className={`difficulty ${flashcards[currentCardIndex]?.difficulty}`}>
              {flashcards[currentCardIndex]?.difficulty}
            </div>
          </div>

          {/* Back of the card */}
          <div className="flashcard-back">
            <div className="answer">{flashcards[currentCardIndex]?.answer}</div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <button onClick={previousCard}>Back</button>
          <button onClick={nextCard}>Next</button>
        </div>
      </div>

      {/* Flashcard List */}
      <ul className="flashcard-list">
        {flashcards.map((flashcard, index) => (
          <li key={flashcard.id} onClick={() => setCurrentCardIndex(index)}>
            {flashcard.question}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 TestVars-Flashcards. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewSet;
