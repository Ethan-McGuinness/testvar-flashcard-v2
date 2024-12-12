import React, { useState, useEffect } from 'react';
import axiosInstance from '../utilities/axiosInstance';
import { Link } from 'react-router-dom';
import './AdminFlashcard.css';

// Interface for flashcard data
interface Flashcard {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
  flashcardSetId: number;
}

// Interface for flashcard set data
interface FlashcardSet {
  id: number;
  name: string;
}

const AdminFlashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('');
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axiosInstance.get('/flashcards');
        setFlashcards(response.data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    const fetchFlashcardSets = async () => {
      try {
        const response = await axiosInstance.get('/sets');
        setFlashcardSets(response.data);
      } catch (error) {
        console.error('Error fetching flashcard sets:', error);
      }
    };

    fetchFlashcards();
    fetchFlashcardSets();
  }, []);

  const handleAdd = async () => {
    if (selectedSetId === null) {
      alert('Please select a flashcard set.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/sets/${selectedSetId}/cards`, {
        question: newQuestion,
        answer: newAnswer,
        difficulty: newDifficulty,
      });
      setFlashcards([...flashcards, response.data]);
      setNewQuestion('');
      setNewAnswer('');
      setNewDifficulty('');
      setSelectedSetId(null);
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setNewQuestion(flashcard.question);
    setNewAnswer(flashcard.answer);
    setNewDifficulty(flashcard.difficulty);
    setSelectedSetId(flashcard.flashcardSetId);
  };

  const handleSave = async () => {
    if (editingFlashcard) {
      try {
        await axiosInstance.put(`/cards/edit/${editingFlashcard.id}`, {
          question: newQuestion,
          answer: newAnswer,
          difficulty: newDifficulty,
        });
        setFlashcards(flashcards.map(fc =>
          fc.id === editingFlashcard.id ? {
            ...fc,
            question: newQuestion,
            answer: newAnswer,
            difficulty: newDifficulty
          } : fc
        ));
        setEditingFlashcard(null);
        setNewQuestion('');
        setNewAnswer('');
        setNewDifficulty('');
        setSelectedSetId(null);
      } catch (error) {
        console.error(`Error updating flashcard with ID ${editingFlashcard.id}:`, error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/cards/delete/${id}`);
      setFlashcards(flashcards.filter(fc => fc.id !== id));
    } catch (error) {
      console.error(`Error deleting flashcard with ID ${id}:`, error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li><Link to="/admin/collections">Manage Collections</Link></li>
          <li><Link to="/admin/sets">Manage Sets</Link></li>
          <li><Link to="/admin/flashcards">Manage Flashcards</Link></li>
          <li><Link to="/admin/users">Manage Users</Link></li>
        </ul>
      </nav>
      <div className="admin-flashcards">
        <h2>Admin Flashcards</h2>
        <div className="fixed-inputs">
          <input
            type="text"
            placeholder="Question"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
          />
          <input
            type="text"
            placeholder="Answer"
            value={newAnswer}
            onChange={e => setNewAnswer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Difficulty"
            value={newDifficulty}
            onChange={e => setNewDifficulty(e.target.value)}
          />
          <select value={selectedSetId ?? ''} onChange={e => setSelectedSetId(Number(e.target.value))}>
            <option value="" disabled>Select a flashcard set</option>
            {flashcardSets.map(set => (
              <option key={set.id} value={set.id}>{set.name}</option>
            ))}
          </select>
          <button onClick={editingFlashcard ? handleSave : handleAdd}>
            {editingFlashcard ? 'Save' : 'Add New Flashcard'}
          </button>
        </div>
        <div className="scrollable-content">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flashcards.map(flashcard => (
                <tr key={flashcard.id}>
                  <td>{flashcard.id}</td>
                  <td>
                    {editingFlashcard && editingFlashcard.id === flashcard.id ? (
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={e => setNewQuestion(e.target.value)}
                      />
                    ) : (
                      flashcard.question
                    )}
                  </td>
                  <td>
                    {editingFlashcard && editingFlashcard.id === flashcard.id ? (
                      <input
                        type="text"
                        value={newAnswer}
                        onChange={e => setNewAnswer(e.target.value)}
                      />
                    ) : (
                      flashcard.answer
                    )}
                  </td>
                  <td>
                    {editingFlashcard && editingFlashcard.id === flashcard.id ? (
                      <input
                        type="text"
                        value={newDifficulty}
                        onChange={e => setNewDifficulty(e.target.value)}
                      />
                    ) : (
                      flashcard.difficulty
                    )}
                  </td>
                  <td>
                    {editingFlashcard && editingFlashcard.id === flashcard.id ? (
                      <button onClick={handleSave}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(flashcard)}>Edit</button>
                        <button onClick={() => handleDelete(flashcard.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFlashcards;
