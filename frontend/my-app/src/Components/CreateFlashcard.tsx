import React, { useState } from 'react';
import axios from 'axios';

interface FlashcardSet {
  id: number;
  name: string;
}

interface CreateFlashcardProps {
  flashcardSets: FlashcardSet[];
}

const CreateFlashcard: React.FC<CreateFlashcardProps> = ({ flashcardSets }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [flashcardSetId, setFlashcardSetId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/sets/${flashcardSetId}/cards`, {
        question,
        answer,
        difficulty,
      });
      setSuccess('Flashcard created successfully!');
      setQuestion('');
      setAnswer('');
      setDifficulty('');
      setFlashcardSetId(null);
    } catch (error) {
      setError('Failed to create flashcard.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Question:</label>
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
      </div>
      <div>
        <label>Answer:</label>
        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
      </div>
      <div>
        <label>Difficulty:</label>
        <input type="text" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required />
      </div>
      <div>
        <label>Flashcard Set:</label>
        <select value={flashcardSetId || ''} onChange={(e) => setFlashcardSetId(Number(e.target.value))} required>
          <option value="" disabled>Select a flashcard set</option>
          {flashcardSets.map((set) => (
            <option key={set.id} value={set.id}>{set.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Create Flashcard</button>
      {success && <p>{success}</p>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default CreateFlashcard;
