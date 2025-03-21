import React from 'react';

const Sidebar = ({ darkMode, sidebarOpen, searchHistory, onHistoryClick, onDeleteHistory }) => {
  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 p-4 transform transition-transform duration-300 ease-in-out ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}
    >
      {/* Sidebar Content */}
      <h2 className="text-lg font-semibold mb-4">Search History</h2>
      <ul>
        {searchHistory.map((message, index) => (
          <li key={index} className="mb-2 flex justify-between items-center">
            <button
              onClick={() => onHistoryClick(message)}
              className={`text-left hover:underline ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {message}
            </button>
            <button
              onClick={() => onDeleteHistory(index)}
              className={`text-red-500 hover:text-red-700`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;