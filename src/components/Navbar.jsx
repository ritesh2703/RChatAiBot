import React from 'react';

const Navbar = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 p-4 shadow-lg z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 bg-blue-500 text-white rounded-lg mr-4"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold">RchatAI</h1>
        </div>
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