'use client';
import React from 'react';
import { useState } from 'react';

const AiPage = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', text: input };
    setMessages([...messages, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: 'This is a sample response.' }]);
    }, 800);

    setInput('');
  };

  return (
    <div className='flex items-center justify-center h-screen w-screen bg-gray-100'>
      <div className='relative bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 h-5/6 border rounded-lg shadow-lg flex flex-col'>
        
        {/* Header */}
        <div className='w-full h-14 bg-gray-700 flex items-center justify-center px-4'>
          <h2 className='text-white text-xl font-semibold'>AI Assistant</h2>
        </div>

        {/* Chat Area */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className='lower w-full bg-gray-100 p-4 flex items-center space-x-2 border-t'>
          <input
            type='text'
            className='flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
            placeholder='Type your message...'
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className='bg-gray-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded-full transition'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPage;
