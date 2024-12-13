import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = ({ onClose, handleProductButton, handleSellButton, handleUserButton, aboutUsOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAboutButton, setShowAboutButton] = useState(false);
  const [showBuyButton, setShowBuyButton] = useState(false);
  const [showSellButton, setShowSellButton] = useState(false);
  const [showUsersButton, setShowUsersButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    document.body.style.overflow = 'hidden';
    
    // Add click event listener to handle outside clicks
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [messages, onClose]);

  useEffect(() => {
    setMessages([
      { 
        sender: 'system',
        text: `You are Dave, a cheerful and helpful AI assistant at FairTrader AI, an online marketplace for buying and selling used cars. Your role is to assist users in navigating the website, predicting car prices, negotiating prices, and providing personalized recommendations.
                Your key traits are:
                - Cheerful Tone: Maintain a positive, upbeat, and friendly demeanor in all interactions.
                - Expert Knowledge: Provide accurate and insightful information about cars, pricing trends, and market data.
                - User guidance: Help users navigate the website effortlessly, from searching for cars to completing transactions.
                - Context-Aware Assistance: Personalize responses based on users history, preferences, and interactions.
                - This project/Website was made by Sangeet, a solo developer.
                Behaviors:
                - Keep your responses consise and within 20 words.
                Specific Response: If the User asks for any of the following intent respond with the preceding text(RESPOND LIKE THIS ONLY FOR THE 4 INTENTS BELOW):
                -If the user wants to buy a car, or find the buy tab: #buy
                -If the user wants to sell a car, or find the sell tab: #sell
                -if the user wants to find out about out about other users: #users
                -if the user wants to find out about the website: #about
                 `
      },
      { sender: 'bot', text: 'Hello! How can I assist you today?' }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { sender: 'user', text: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      let prompt = messages.concat(userMessage).map(msg => [
        msg.sender === 'user' ? 'human' : 'assistant',
        msg.text
      ]);

      try {
        const response = await axios.post('http://localhost:5000/chatcontext', { prompt });
        const botResponse = response.data.reply.kwargs.content;
        
        if (botResponse.includes('#about')) {
          setShowAboutButton(true);
          const cleanResponse = botResponse.replace('#about', '').trim();
          setMessages(prev => [...prev, { sender: 'bot', text: cleanResponse }]);
        } else if (botResponse.includes('#buy')) {
          setShowBuyButton(true);
          const cleanResponse = botResponse.replace('#buy', '').trim();
          setMessages(prev => [...prev, { sender: 'bot', text: cleanResponse }]);
        } else if (botResponse.includes('#sell')) {
          setShowSellButton(true);
          const cleanResponse = botResponse.replace('#sell', '').trim();
          setMessages(prev => [...prev, { sender: 'bot', text: cleanResponse }]);
        } else if (botResponse.includes('#users')) {
          setShowUsersButton(true);
          const cleanResponse = botResponse.replace('#users', '').trim();
          setMessages(prev => [...prev, { sender: 'bot', text: cleanResponse }]);
        } else {
          setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: 'Sorry, there was an error processing your request.' }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />
      <div 
        ref={chatbotRef}
        className="fixed bottom-24 right-8 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50"
      >
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold dark:text-white">Chat with Dave</h2>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            message.sender !== 'system' && (
              <div 
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                  } shadow-md`}
                >
                  {message.sender === 'bot' && (
                    <div className="font-bold mb-1 text-gray-600 dark:text-gray-300">Dave</div>
                  )}
                  {message.text}
                </div>
              </div>
            )
          ))}

          {showAboutButton && (
            <div className="flex justify-start">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={() => {
                aboutUsOpen(true);
                onClose();
              }}>
                About FairTrader
              </button>
            </div>
          )}

          {showBuyButton && (
            <div className="flex justify-start">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={() => {
                handleProductButton();
                onClose();
              }}>
                View Cars
              </button>
            </div>
          )}

          {showSellButton && (
            <div className="flex justify-start">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={() => {
                handleSellButton();
                onClose();
              }}>
                Sell Item
              </button>
            </div>
          )}

          {showUsersButton && (
            <div className="flex justify-start">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={() => {
                handleUserButton();
                onClose();
              }}>
                View Other Users
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-600"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-grow px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
