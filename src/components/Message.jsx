import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCopy, FaShare, FaThumbsUp, FaThumbsDown, FaEdit } from 'react-icons/fa';

const Message = ({ text, isUser, darkMode, onEdit, onLike, onDislike }) => {
  const [displayText, setDisplayText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isUser) {
      setDisplayText(text);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 20); // Adjust speed of typewriter effect

    return () => clearInterval(interval);
  }, [text, isUser]);

  // Check if the message contains code
  const isCode = text.startsWith('```') && text.endsWith('```');

  // Format Markdown-like text (headings, bold, italic, lists)
  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/\#\s(.*?)\n/g, '<h3>$1</h3>') // Heading 1
      .replace(/\##\s(.*?)\n/g, '<h4>$1</h4>') // Heading 2
      .replace(/\-\s(.*?)\n/g, '<li>$1</li>') // List items
      .replace(/\n/g, '<br>'); // Line breaks
  };

  // Handle copy button click
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle save edited message
  const handleSave = () => {
    setIsEditing(false);
    onEdit(editedText); // Pass the edited text to the parent component
  };

  // Handle like button click
  const handleLike = () => {
    setLiked(!liked);
    setDisliked(false); // Disable dislike if like is clicked
    onLike();
  };

  // Handle dislike button click
  const handleDislike = () => {
    setDisliked(!disliked);
    setLiked(false); // Disable like if dislike is clicked
    onDislike();
  };

  return (
    <div className={`my-2 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block p-3 rounded-lg max-w-3xl ${
          isUser
            ? darkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : darkMode
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        {isUser && isEditing ? (
          <div className="flex items-center">
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="flex-1 p-2 rounded-lg outline-none bg-white text-gray-900"
            />
            <button
              onClick={handleSave}
              className="ml-2 p-2 bg-green-500 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            {isCode ? (
              <div className="bg-black p-4 rounded-lg">
                <SyntaxHighlighter
                  language="python" // Change language as needed
                  style={dracula} // Use a syntax-highlighting theme
                  customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
                >
                  {text.slice(3, -3)} // Remove the triple backticks
                </SyntaxHighlighter>
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: formatText(displayText) }}
                className="prose" // Use Tailwind's prose for better text formatting
              />
            )}

            {/* Buttons for Copy, Share, Like, Dislike (only for AI responses) */}
            {!isUser && (
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleCopy}
                  className="p-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {copied ? 'Copied!' : <FaCopy />}
                </button>
                <button onClick={() => alert('Share functionality not implemented yet.')} className="p-1 text-sm text-gray-500 hover:text-gray-700">
                  <FaShare />
                </button>
                <button
                  onClick={handleLike}
                  className={`p-1 text-sm ${liked ? 'text-blue-500' : 'text-gray-500'} hover:text-gray-700`}
                >
                  <FaThumbsUp />
                </button>
                <button
                  onClick={handleDislike}
                  className={`p-1 text-sm ${disliked ? 'text-red-500' : 'text-gray-500'} hover:text-gray-700`}
                >
                  <FaThumbsDown />
                </button>
              </div>
            )}

            {/* Edit button for user messages */}
            {isUser && !isEditing && (
              <button
                onClick={handleEdit}
                className="p-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <FaEdit />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;