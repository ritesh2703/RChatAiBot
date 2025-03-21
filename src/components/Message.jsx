import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCopy, FaShare, FaThumbsUp, FaThumbsDown, FaEdit, FaUser, FaRobot } from 'react-icons/fa';

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
    }, 20);

    return () => clearInterval(interval);
  }, [text, isUser]);

  const isCode = text.startsWith('```') && text.endsWith('```');

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit(editedText);
  };

  const handleLike = () => {
    setLiked(!liked);
    setDisliked(false);
    onLike();
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    setLiked(false);
    onDislike();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Message copied to clipboard!');
    });
  };

  return (
    <div className={`my-2 ${isUser ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`mx-2 ${isUser ? 'text-blue-500' : 'text-green-500'}`}>
          {isUser ? <FaUser size={24} /> : <FaRobot size={24} />}
        </div>
        <div
          className={`inline-block p-3 rounded-lg max-w-3xl shadow-lg ${
            isUser
              ? darkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white'
              : darkMode
              ? 'bg-gray-700 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
          style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
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
                  <div className="text-sm text-gray-400 mb-2">
                    {text.split('\n')[0].replace('```', '').trim() || 'code'}
                  </div>
                  <SyntaxHighlighter
                    language={text.split('\n')[0].replace('```', '').trim() || 'text'}
                    style={dracula}
                    customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
                  >
                    {text.slice(3, -3)}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <ReactMarkdown
                  children={displayText}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-2" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-2" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-base font-bold my-2" {...props} />,
                    p: ({ node, ...props }) => <p className="my-2" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5" {...props} />,
                    li: ({ node, ...props }) => <li className="my-1" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-gray-500 pl-4 italic" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <div className="bg-black p-4 rounded-lg">
                        <SyntaxHighlighter
                          language="text"
                          style={dracula}
                          customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
                        >
                          {props.children}
                        </SyntaxHighlighter>
                      </div>
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-blue-500 hover:underline" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <table className="min-w-full divide-y divide-gray-200" {...props} />
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-gray-50" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody className="bg-white divide-y divide-gray-200" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                      <tr className="hover:bg-gray-50" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props} />
                    ),
                  }}
                />
              )}

              {!isUser && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleCopy}
                    className="p-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {copied ? 'Copied!' : <FaCopy />}
                  </button>
                  <button onClick={handleShare} className="p-1 text-sm text-gray-500 hover:text-gray-700">
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
    </div>
  );
};

export default Message;