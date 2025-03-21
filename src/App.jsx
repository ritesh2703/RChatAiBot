import React, { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const updateSearchHistory = (message) => {
    setSearchHistory((prev) => [...prev, message]);
  };

  const handleHistoryClick = (message) => {
    setCurrentChat([{ text: message, isUser: true }]);
  };

  const handleDeleteHistory = (index) => {
    setSearchHistory((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        searchHistory={searchHistory}
        onHistoryClick={handleHistoryClick}
        onDeleteHistory={handleDeleteHistory}
      />

      {/* Chatbot Section */}
      <div className={`pt-16 h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Chatbot
          darkMode={darkMode}
          updateSearchHistory={updateSearchHistory}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
        />
      </div>
    </div>
  );
}

export default App;