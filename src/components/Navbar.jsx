import React from 'react';

const Navbar = ({ darkMode, toggleDarkMode, toggleSidebar, sidebarOpen }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 p-4 shadow-lg z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          {sidebarOpen ? '✕' : '☰'} {/* Show cross (✕) when sidebar is open */}
        </button>

        {/* Centered Title */}
        <h1 className="text-2xl font-bold flex-grow text-center">RchatAI</h1>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;