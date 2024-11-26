import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/features">Features</Link></li>
          {/* Add more links as needed */}
        </ul>
      </nav>

      {/* Hero Section */}
      <header>
        <h1>Welcome to TestVars-Flashcards</h1>
        <p>The best way for you to study.</p>
      </header>

      {/* Main Content */}
      <section>
        <h2>Features</h2>
        <div>
          <div>
            <h3>Feature 1</h3>
            <p>Explanation of feature 1.</p>
          </div>
          <div>
            <h3>Feature 2</h3>
            <p>Explanation of feature 2.</p>
          </div>
          <div>
            <h3>Feature 3</h3>
            <p>Explanation of feature 3.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 [TestVars-Flashcards]. All rights reserved.</p>
        <ul>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms of Service</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </footer>
    </div>
  );
};

export default HomePage;
