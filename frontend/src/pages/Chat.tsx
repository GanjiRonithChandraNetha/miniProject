import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Chat = () => {
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Alice Johnson',
      lastMessage: 'Thanks for your proposal!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      unread: true,
    },
    {
      id: 2,
      name: 'Bob Smith',
      lastMessage: 'When can you start?',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      unread: false,
    },
  ];

  const messages = [
    {
      id: 1,
      content: 'Hi, I saw your profile and I\'m interested in your services.',
      sender: 'them',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      content: 'Hello! Thank you for reaching out. I\'d be happy to discuss your project.',
      sender: 'me',
      timestamp: '10:32 AM',
    },
  ];

  return (
    <div className="h-[calc(100vh-5rem)] flex">
      {/* Conversation List */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conversation.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread && (
                  <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={conversations[0].avatar}
              alt={conversations[0].name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{conversations[0].name}</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md ${
                  message.sender === 'me'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900'
                } rounded-lg px-4 py-2 shadow`}
              >
                <p>{message.content}</p>
                <p className={`text-xs ${
                  message.sender === 'me' ? 'text-indigo-200' : 'text-gray-500'
                } mt-1`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;