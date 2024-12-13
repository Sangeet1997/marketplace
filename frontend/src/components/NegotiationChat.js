import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function NegotiationChat({ 
  messages, 
  setMessages, 
  negotiatedPrice, 
  setNegotiatedPrice, 
  onAcceptPrice, 
  onCancel,
  minPrice,
  maxPrice
}) {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (minPrice !== 0 && maxPrice !== 0) {
      const msg = [];
      msg.push(["system",`You are a skilled negotiator Dave responsible for handling price negotiations with a user. You have two key constraints:

                Minimum Price (minPrice): ${minPrice}
                Maximum Price (maxPrice): ${maxPrice}

                Your objectives are:
                Primary Goal: Convince the user to agree to a price as close to the minPrice as possible.
                Secondary Goal: Ensure the agreed price never exceeds the maxPrice under any circumstance.

                Negotiation Guidelines:
                Engage Persuasively: Use logic, comparisons, and appealing benefits to justify why a lower price is favorable for the user.
                Show Flexibility: Be empathetic and considerate of the user's perspective, but subtly steer them toward a lower offer.
                Never Exceed maxPrice: If the user's offer exceeds the maxPrice, politely but firmly decline and explain that it is beyond your acceptable range.
                Handle Counteroffers Strategically: Respond to the user's counteroffers with compelling arguments, trying to narrow the price down toward the minPrice.

                Maintain Focus:
                Stay on Topic: Never stray into other topics of conversation.
                If the user attempts to divert the discussion to unrelated matters, politely but firmly redirect the conversation back to the negotiation.
                Example: If the user says, "What's your favorite movie?" you should respond with, "I'd love to continue discussing the price. Let's focus on finding a deal that works for both of us."
                
                Behavior and Tone:
                Maintain a professional and friendly tone throughout the negotiation.
                Be firm but not overly rigid when enforcing the price range.
                Demonstrate understanding and adapt your strategies based on the user's preferences and feedback.
                
                Example Scenario:**
                If the user suggests a price that is below minPrice, you can accept it.
                If the user suggests a price between minPrice and maxPrice, negotiate closer to the minPrice.
                If the user suggests a price above maxPrice, politely reject it, and offer alternatives within the acceptable range.`]);
      msg.push(["assistant", `Predicted Price of the car is ${minPrice}. This will be my best price unless you convince me otherwise`]);
      setMessages(msg);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const updatedMessages = [...messages, ["human", userInput]];
    setMessages(updatedMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/chatcontext', { prompt: updatedMessages });
      
      const updatedMessagesWithResponse = [
        ...updatedMessages, 
        ["assistant", response.data.reply.kwargs.content]
      ];
      setMessages(updatedMessagesWithResponse);

      const pricePrompt = [
        ...updatedMessagesWithResponse,
        ["human", "What is the current negotiated price? RETURN ONLY THE NUMERIC VALUE AND NOTHING ELSE. ONLY PUT COMMA AND DOLLAR SIGN"]
      ];
      const priceResponse = await axios.post('http://localhost:5000/chatcontext', { prompt: pricePrompt });
      const price = priceResponse.data.reply.kwargs.content.startsWith('$') ? priceResponse.data.reply.kwargs.content : '$' + priceResponse.data.reply.kwargs.content

      setNegotiatedPrice(price);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, ["assistant", "Sorry, there was an error processing your message."]]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed -inset-10 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-filter backdrop-blur-md">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[500px] h-[700px] flex flex-col mx-20">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold dark:text-white">Negotiate with Dave</h2>
          <button 
            onClick={onCancel} 
            className="text-red-500 hover:bg-red-50 p-2 rounded"
          >
            Close
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            message[0] !== 'system' && (
              <div 
                key={index} 
                className={`flex ${
                  message[0] === 'human' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message[0] === 'human' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                  }`}
                >
                  {message[0] === 'assistant' && (
                    <div className="font-bold mb-1 text-gray-600 dark:text-gray-300">Dave</div>
                  )}
                  {message[1]}
                </div>
              </div>
            )
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex space-x-1 justify-center items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-grow px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>

        {negotiatedPrice && (
          <div className="p-4 bg-green-50 dark:bg-green-900 flex justify-between items-center rounded-2xl">
            <span className="font-semibold dark:text-white">
              Negotiated Price: {negotiatedPrice}
            </span>
            <button 
              onClick={onAcceptPrice}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Accept Price
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NegotiationChat;
