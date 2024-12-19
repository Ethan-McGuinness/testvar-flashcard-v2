import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ViewFlashcards from './pages/ViewFlashcards';
import ViewSet from './pages/ViewSet';
import CreatePage from './pages/CreatePage';
import BrowsePage from './pages/BrowsePage';
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard component
import AdminCollections from './pages/AdminCollections';
import AdminSets from './pages/AdminSets';
import AdminFlashcards from './pages/AdminFlashcards';
import AdminUsers from './pages/AdminUsers';
import UserManagementPage from './pages/userManagement';
import UserCollections from './pages/manageCollection';
import UserSets from './pages/manageSets';
import UserFlashcards from './pages/manageFlashcards';


function App() {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if the user is an admin

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={isAdmin ? <Navigate to="/admin-dashboard" /> : <HomePage />} />
          <Route path="/flashcards" element={<ViewFlashcards />} />
          <Route path="/sets/:setId/cards" element={<ViewSet />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/UserManagement" element={<UserManagementPage />} />
          <Route path="/user/collections" element={<UserCollections />} />
          <Route path="/user/sets" element={<UserSets />} />
          <Route path="/user/flashcards" element={<UserFlashcards />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/collections" element={<AdminCollections />} />
          <Route path="/admin/sets" element={<AdminSets />} />
          <Route path="/admin/flashcards" element={<AdminFlashcards />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
