import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewSet.css';
import { Link } from 'react-router-dom';

const ViewSet = () => {
  const { setId } = useParams<{ setId: string }>();
  const [setName, setSetName] = useState<string>(''); 
  const [flashcards, setFlashcards] = useState<any[]>([]); 
  const [hiddenFlashcards, setHiddenFlashcards] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0); 
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]); 

  // Fetch set details and flashcards
  useEffect(() => {
    if (!setId) return;

    const fetchSetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sets/${setId}`);
        setSetName(response.data.name); 
      } catch (error) {
        setError('Error retrieving set details');
        setLoading(false);
      }
    };
    fetchSetDetails();
  }, [setId]);

  useEffect(() => {
    if (!setId) return;
  
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sets/${setId}/cards`);
        const flashcards: any[] = response.data; // Temporarily using any[] type for simplicity
  
        // Separate hidden and visible flashcards
        const visibleFlashcards = flashcards.filter((card) => !card.hiddenState);
        const hiddenFlashcards = flashcards.filter((card) => card.hiddenState);
  
        setFlashcards(visibleFlashcards);
        setHiddenFlashcards(hiddenFlashcards);
        setLoading(false);
      } catch (error) {
        setError('Error retrieving flashcards');
        setLoading(false);
      }
    };
  
    fetchFlashcards();
  }, [setId]);
  

  const handleFlipCard = () => {
    setFlippedCards(prev => {
      const newFlippedCards = [...prev];
      newFlippedCards[currentCardIndex] = !newFlippedCards[currentCardIndex];
      return newFlippedCards;
    });
  };

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const previousCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const hideCard = async (cardId: number) => {
    try {
      // Move card to hidden list
      setFlashcards(prevFlashcards => {
        const updatedFlashcards = prevFlashcards.filter(card => card.id !== cardId);
        setHiddenFlashcards(prevHiddenFlashcards => {
          // Add card to hidden list only if not already present
          if (!prevHiddenFlashcards.some(card => card.id === cardId)) {
            return [...prevHiddenFlashcards, prevFlashcards.find(card => card.id === cardId)!];
          }
          return prevHiddenFlashcards;
        });
        return updatedFlashcards;
      });

      // Make the network request to hide the card
      await axios.patch(`http://localhost:5000/cards/${cardId}/hidden`, { hiddenState: true });
    } catch (error) {
      console.error('Error hiding flashcard:', error);
      setError('Failed to hide the card.');
    }
  };

  const unhideCard = async (cardId: number) => {
    try {
      // Move card back to visible list
      setHiddenFlashcards(prevHiddenFlashcards => {
        const updatedHiddenFlashcards = prevHiddenFlashcards.filter(card => card.id !== cardId);
        setFlashcards(prevFlashcards => {
          // Add card back to visible list only if not already present
          if (!prevFlashcards.some(card => card.id === cardId)) {
            return [...prevFlashcards, prevHiddenFlashcards.find(card => card.id === cardId)!];
          }
          return prevFlashcards;
        });
        return updatedHiddenFlashcards;
      });

      // Make the network request to unhide the card
      await axios.patch(`http://localhost:5000/cards/${cardId}/hidden`, { hiddenState: false });
    } catch (error) {
      console.error('Error unhiding flashcard:', error);
      setError('Failed to unhide the card.');
    }
  };

  const handleCardClick = (cardId: number, isHidden: boolean) => {
    const cardIndex = isHidden
      ? hiddenFlashcards.findIndex(card => card.id === cardId)
      : flashcards.findIndex(card => card.id === cardId);
      
    if (cardIndex !== -1) {
      setCurrentCardIndex(cardIndex);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="view-set">
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/flashcards">View your Flashcard</Link></li>
          <li><Link to="/create">Create Flashcards</Link></li>
          <li><Link to="/">Log Out</Link></li>
        </ul>
      </nav>

      <header>
        <h1>{setName}</h1>
      </header>

      <div className="flashcard-container">
        <div
          className={`flashcard ${flippedCards[currentCardIndex] ? 'flipped' : ''} ${flashcards[currentCardIndex]?.hidden ? 'hidden' : ''}`}
          onClick={handleFlipCard}
        >
          <div className="flashcard-front">
            <div className="question">{flashcards[currentCardIndex]?.question}</div>
            <div className={`difficulty ${flashcards[currentCardIndex]?.difficulty}`}>
              {flashcards[currentCardIndex]?.difficulty}
            </div>
            <button className="hide-button" onClick={(e) => { e.stopPropagation(); hideCard(flashcards[currentCardIndex]?.id); }} > Hide </button>
          </div>
          <div className="flashcard-back">
            <div className="answer">{flashcards[currentCardIndex]?.answer}</div>
          </div>
        </div>

        <div className="navigation-buttons">
          <button onClick={previousCard}>Back</button>
          <button onClick={nextCard}>Next</button>
        </div>
      </div>

          <ul className="flashcard-list">
      {flashcards.map((flashcard) => (
        <li key={flashcard.id} onClick={() => handleCardClick(flashcard.id, false)}>
          {flashcard.question}
        </li>
      ))}
    </ul>

    <div className="hidden-cards">
      <ul>
        {hiddenFlashcards.map((flashcard) => (
          <li key={flashcard.id} onClick={() => handleCardClick(flashcard.id, true)}>
            {flashcard.question}
            <button onClick={() => unhideCard(flashcard.id)}>Unhide</button>
          </li>
        ))}
      </ul>
    </div>


      <footer>
        <p>&copy; 2024 TestVars-Flashcards. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewSet;
