import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';

function UserCard({ username, email, image, soldItems, boughtItems }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soldItemDetails, setSoldItemDetails] = useState([]);
  const [boughtItemDetails, setBoughtItemDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
    fetchItemDetails();
  };
  
  const closeModal = () => setIsModalOpen(false);

  const fetchItemDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'x-auth-token': token };

      const soldPromises = soldItems.map(itemId => 
        axios.get(`http://localhost:3000/v1/items/${itemId}`, { headers })
      );

      const boughtPromises = boughtItems.map(itemId => 
        axios.get(`http://localhost:3000/v1/items/${itemId}`, { headers })
      );

      const [soldResponses, boughtResponses] = await Promise.all([
        Promise.all(soldPromises),
        Promise.all(boughtPromises)
      ]);

      setSoldItemDetails(soldResponses.map(res => res.data));
      setBoughtItemDetails(boughtResponses.map(res => res.data));
    } catch (err) {
      setError('Error fetching item details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            {image ? (
              <img 
                src={image} 
                alt={username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-blue-600 dark:text-blue-400 text-lg font-semibold">
                {username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {username}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            Sold Items: {soldItems.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            Bought Items: {boughtItems.length}
          </p>
        </div>
      </div>
      <button
        onClick={openModal}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        Check Items
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-semibold mb-4">User Items</h2>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Sold Items:</h3>
              {soldItemDetails.length === 0 ? (
                <p className="text-gray-500">No items sold yet</p>
              ) : (
                <ul className="space-y-2">
                  {soldItemDetails.map((item) => (
                    <li key={item._id} className="border-b pb-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${item.price}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Bought Items:</h3>
              {boughtItemDetails.length === 0 ? (
                <p className="text-gray-500">No items bought yet</p>
              ) : (
                <ul className="space-y-2">
                  {boughtItemDetails.map((item) => (
                    <li key={item._id} className="border-b pb-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${item.price}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default UserCard;
