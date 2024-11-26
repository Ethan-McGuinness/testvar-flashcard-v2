import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ViewFlashcards.css';

const ViewFlashcards: React.FC = () => {
  const [expandedCollection, setExpandedCollection] = useState<number | null>(null);

  // Example collections and sets
  const collections = [
    {
      name: 'Science',
      sets: ['Biology Basics', 'Physics Equations', 'Chemistry Reactions'],
    },
    {
      name: 'History',
      sets: ['World War II', 'Ancient Civilizations', 'Modern Politics'],
    },
    {
      name: 'Languages',
      sets: ['Spanish Vocabulary', 'French Grammar', 'English Idioms'],
    },
  ];

  const toggleCollection = (index: number) => {
    if (expandedCollection === index) {
      setExpandedCollection(null); // Collapse if it's already expanded
    } else {
      setExpandedCollection(index); // Expand this collection
    }
  };

  return (
    <div className="view-flashcards">
      {/* Navbar */}
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/create">Create Flashcards</Link></li>
          <li><Link to="/">Log Out</Link></li>
        </ul>
      </nav>

      {/* Header */}
      <header>
        <h1>View Flashcards</h1>
        <p>Explore flashcards by collection and set.</p>
      </header>

      {/* Categories and Collections Section */}
      <main>
        {collections.map((collection, index) => (
          <div className="collection" key={index}>
            <h2 onClick={() => toggleCollection(index)}>{collection.name}</h2>
            {expandedCollection === index && (
              <ul>
                {collection.sets.map((set, idx) => (
                  <li key={idx}>
                    <Link to={`/sets/${set.replace(/\s+/g, '-').toLowerCase()}`}>
                      {set}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 TestVars-Flashcards. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewFlashcards;
