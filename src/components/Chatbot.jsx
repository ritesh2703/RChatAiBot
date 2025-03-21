import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../utils/geminiApi'; // Import the Gemini API utility
import Message from './Message';

const Chatbot = ({ darkMode, updateSearchHistory }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false); // Add "AI Thinking" state
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false; // Stop after one sentence
    recognitionInstance.interimResults = false; // Only final results
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); // Set recorded text to input
      setIsListening(false); // Stop listening
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false); // Ensure listening stops
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop(); // Cleanup
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    updateSearchHistory(input); // Add to search history
    setInput('');
    setIsThinking(true); // Start "AI Thinking"

    try {
      const aiResponse = await getGeminiResponse(input); // Get Gemini response
      const botMessage = { text: aiResponse, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setIsThinking(false); // Stop "AI Thinking"
    }
  };

  const handleEditMessage = async (index, newText) => {
    const updatedMessages = [...messages];
    updatedMessages[index].text = newText; // Update the user message
    setMessages(updatedMessages);

    setIsThinking(true); // Start "AI Thinking"

    try {
      const aiResponse = await getGeminiResponse(newText); // Regenerate AI response
      const botMessage = { text: aiResponse, isUser: false };
      setMessages((prev) => [...prev.slice(0, index + 1), botMessage, ...prev.slice(index + 2)]); // Preserve subsequent messages
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setIsThinking(false); // Stop "AI Thinking"
    }
  };

  const handleLike = () => {
    console.log('Liked!');
  };

  const handleDislike = () => {
    console.log('Disliked!');
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognition.stop(); // Stop recording
      setIsListening(false);
    } else {
      recognition.start(); // Start recording
      setIsListening(true);
    }
  };

  return (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="flex-1 p-4 overflow-y-auto pb-24"> {/* Add padding-bottom to avoid overlap */}
        {messages.map((msg, index) => (
          <Message
            key={index}
            text={msg.text}
            isUser={msg.isUser}
            darkMode={darkMode}
            onEdit={(newText) => handleEditMessage(index, newText)} // Pass edit handler
            onLike={handleLike} // Pass like handler
            onDislike={handleDislike} // Pass dislike handler
          />
        ))}
        {isThinking && (
          <div className="my-2 text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-900">
              AI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Search Bar at Bottom */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 border-t ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className={`flex-1 p-2 rounded-lg outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          />
          <button
            onClick={handleVoiceInput}
            className={`ml-2 p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          >
            {isListening ? '🛑' : '🎤'}
          </button>
          <button
            onClick={handleSend}
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;