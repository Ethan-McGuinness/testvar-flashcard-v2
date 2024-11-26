import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Import LoginPage component
import HomePage from './pages/HomePage';
import BrowseFlashcards from './pages/ViewFlashcards';
import ViewFlashcards from './pages/ViewFlashcards';

function App() {
  return (
    <Router> {/* Wrapping the app with Router to enable routing */}
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/flashcards" element={< ViewFlashcards/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
