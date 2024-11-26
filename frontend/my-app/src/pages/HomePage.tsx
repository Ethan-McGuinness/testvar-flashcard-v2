import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <nav>
        <ul>
          <li><Link to="/flashcards">View your Flashcard</Link></li>
          <li><Link to="/create">Create Flashcards</Link></li>
          <li><Link to="/browse">Browse Flashcards</Link></li>
          <li><Link to="/">log Out</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main>
        <header>
          <h1>Welcome to TestVars-Flashcards</h1>
          <p>The best way for you to study.</p>
        </header>

        <section>
          <h2>Features</h2>
          <div>
            <div>
              <h3>View Your Flashcards</h3>
              <li><Link to="/flashcards">View all your Flashcard</Link></li>
            </div>
            <div>
              <h3>Create Flashcards</h3>
              <li><Link to="/create">Create Flashcards to add to your collection</Link></li>
            </div>
            <div>
              <h3>Browse Flashcards</h3>
              <li><Link to="/browse">Browse others flashcards to add to your collection</Link></li>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 [TestVars-Flashcards]. All rights reserved.</p>
      
      </footer>
    </div>
  );
};

export default HomePage;
