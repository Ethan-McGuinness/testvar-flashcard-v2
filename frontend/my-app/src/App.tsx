import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ViewFlashcards from './pages/ViewFlashcards';
import ViewSet from './pages/ViewSet';
import CreatePage from './pages/CreatePage'; // Import CreatePage component

function App() {
  return (
    <Router> 
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/flashcards" element={<ViewFlashcards />} />
          <Route path="/sets/:setId/cards" element={<ViewSet />} />
          <Route path="/create" element={<CreatePage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
