import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const updateSearchHistory = (message) => {
    setSearchHistory((prev) => [...prev, message]);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} searchHistory={searchHistory} />

      {/* Chatbot Section */}
      <div className={`pt-16 h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Chatbot darkMode={darkMode} updateSearchHistory={updateSearchHistory} />
      </div>
    </div>
  );
}

export default App;