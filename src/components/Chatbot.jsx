import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../utils/geminiApi';
import Message from './Message';
import { FaMicrophone } from 'react-icons/fa';

const Chatbot = ({ darkMode, updateSearchHistory }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    updateSearchHistory(input);
    setInput('');
    setIsThinking(true);

    try {
      const aiResponse = await getGeminiResponse(input);
      const botMessage = { text: aiResponse, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleEditMessage = async (index, newText) => {
    const updatedMessages = [...messages];
    updatedMessages[index].text = newText;
    setMessages(updatedMessages);

    setIsThinking(true);

    try {
      const aiResponse = await getGeminiResponse(newText);
      const botMessage = { text: aiResponse, isUser: false };
      setMessages((prev) => [...prev.slice(0, index + 1), botMessage, ...prev.slice(index + 2)]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setIsThinking(false);
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
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-4xl font-bold">Welcome to RchatAI</h1>
              <p className="mt-2 text-lg">Start chatting with the AI to get answers!</p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <Message
            key={index}
            text={msg.text}
            isUser={msg.isUser}
            darkMode={darkMode}
            onEdit={(newText) => handleEditMessage(index, newText)}
            onLike={handleLike}
            onDislike={handleDislike}
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
            <FaMicrophone />
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