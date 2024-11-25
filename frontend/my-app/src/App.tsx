import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Import LoginPage component
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router> {/* Wrapping the app with Router to enable routing */}
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Default route showing the LoginPage */}
          <Route path="/home" element={<HomePage />} /> {/* You can add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
