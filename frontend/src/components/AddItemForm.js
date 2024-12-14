import React, { useState } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import NegotiationChat from './NegotiationChat.js';

const TAGS = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Minivan', 'Wagon'];

function AddItemForm({ owner }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    tag: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [negotiatedPrice, setNegotiatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        700,
        700,
        'JPEG',
        80,
        0,
        (uri) => {
          setFormData({ ...formData, image: uri });
          setImagePreview(uri);
        },
        'base64'
      );
    }
  };

  const handleTagSelection = (tag) => {
    setFormData({ ...formData, tag });
  };

  const startNegotiation = async (itemData) => {
    try {
      setLoading(true);
      setError(null);

      const prompt = [];

      const detailedPrompt = `Name: ${itemData.name}\nDescription: ${itemData.description}\nPredict the max price of this car in dollars\nGIVE ONLY NUMERICAL DATA, DON'T WRITE ANYTHING ELSE.`;
      prompt.push(["human", detailedPrompt]);

      const response = await axios.post('http://localhost:5000/chatrag', { prompt });
      console.log(response)

      prompt.push(["assistant", response.data.reply]);
      setMaxPrice(response.data.reply);

      const detailedPrompt2 = `Predict the min price of this car in dollars. It should be 70% of the ${maxPrice}. \nGIVE ONLY NUMERICAL DATA, DON'T WRITE ANYTHING ELSE.DONT SHOW CALCULATIONS`;
      prompt.push(["human", detailedPrompt2]);

      const response2 = await axios.post('http://localhost:5000/chatrag', { prompt });
      prompt.push(["assistant", response2.data.reply]);
      setMinPrice(response2.data.reply);
      setNegotiatedPrice(response2.data.reply);

      setShowChat(true);
      setLoading(false);
    } catch (error) {
      console.error('Error starting negotiation:', error);
      setError('Failed to start negotiation');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tag) {
      alert('Please select a tag.');
      return;
    }
    const itemData = { ...formData, owner };
    await startNegotiation(itemData);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prevMessages) => [...prevMessages, ["human", userInput]]);

    try {
      const response = await axios.post('http://localhost:5000/chatcontext', { prompt: messages });
      setMessages((prevMessages) => [...prevMessages, ["assistant", response.data.reply.kwargs.content]]);

      const prompt = [...messages, ["human", "What is the current negotiated price? RETURN ONLY THE NUMERIC VALUE AND NOTHING ELSE. ONLY PUT COMMA AND DOLLAR SIGN"]];
      const response2 = await axios.post('http://localhost:5000/chatcontext', { prompt });
      const price = response2.data.reply.kwargs.content.startsWith('$') ? response2.data.reply.kwargs.content : '$' + response2.data.reply.kwargs.content;
      setNegotiatedPrice(price);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setUserInput('');
  };

  const handleAcceptPrice = async () => {
    try {
      const price = parseInt(negotiatedPrice.replace(/[$,]/g, ''));
      const itemData = { ...formData, price, owner };
      
      const itemResponse = await axios.post('http://localhost:3000/v1/items/', itemData);
      const newItemId = itemResponse.data._id;
      console.log(newItemId)
      
      await axios.post('http://localhost:3000/v1/auth/user/sell-item', { 
        itemId: newItemId 
      },  {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      const confirmationDiv = document.createElement('div');
      confirmationDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl z-50 text-center';
      confirmationDiv.innerHTML = `
        <h3 class="text-lg font-semibold mb-4 dark:text-white">Item Listed Successfully!</h3>
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">OK</button>
      `;
      document.body.appendChild(confirmationDiv);
      
      const okButton = confirmationDiv.querySelector('button');
      okButton.onclick = () => {
        document.body.removeChild(confirmationDiv);
        window.location.href = '/dashboard';
      };
      setShowChat(false);
    } catch (error) {
      console.error('Error accepting price:', error);
    }
  };

  const handleCancel = () => {
    setShowChat(false);
    setMessages([]);
    setNegotiatedPrice(null);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="4"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-md"
            />
          )}
        </div>
        <div>
          <label htmlFor="tag" className="block text-sm font-medium mb-1">Select Tag:</label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagSelection(tag)}
                className={`px-4 py-2 rounded-md border focus:outline-none ${
                  formData.tag === tag
                    ? 'bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:border-blue-600'
                    : 'bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Add Item
        </button>
      </form>
      {showChat && (
        <NegotiationChat
          messages={messages}
          setMessages={setMessages}
          negotiatedPrice={negotiatedPrice}
          setNegotiatedPrice={setNegotiatedPrice}
          onAcceptPrice={handleAcceptPrice}
          onCancel={handleCancel}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      )}
      {loading && <div className="fixed inset-0 bg-white bg-opacity-50 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg text-gray-700 font-medium">Performing Semantic search on Database...</p>
      </div>}
    </div>
  );
}

export default AddItemForm;
