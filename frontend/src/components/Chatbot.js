import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';


const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const welcomeMsg = () => {
    setMessages([
      { sender: 'bot', text: 'Hello! How can I assist you today?' },
    ]);
  }

  useEffect(() => {
    welcomeMsg();
  }, []);
  


  const handleSendMessage = async () => {
    if (input.trim()) {
      const updatedMessages = [...messages, { sender: 'user', text: input }];
    setMessages(updatedMessages);
    setInput('');
    
    let prompt = [];
    for (let message of updatedMessages) {
      if (message.sender === 'user') {
        prompt.push(["human", message.text]);
      } else if (message.sender === 'bot') {
        prompt.push(["assistant", message.text]);
      }
    }

    const response = await axios.post('http://localhost:5000/chatcontext', { prompt });
    console.log(response.data.reply.kwargs.content);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: response.data.reply.kwargs.content },
    ]);

    }
  };

  return (
    <div className="fixed bottom-20 right-5 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h3 className="text-lg font-semibold">Chatbot</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
