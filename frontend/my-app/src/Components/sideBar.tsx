import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="sidebar">
      <button onClick={() => onTabChange('flashcards')} className={activeTab === 'flashcards' ? 'active' : ''}>Flashcards</button>
      <button onClick={() => onTabChange('sets')} className={activeTab === 'sets' ? 'active' : ''}>Sets</button>
      <button onClick={() => onTabChange('collections')} className={activeTab === 'collections' ? 'active' : ''}>Collections</button>
    </div>
  );
};

export default Sidebar;
