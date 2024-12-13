import React from 'react';
import { Home, Activity, Settings } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Welcome = ({ user, isDarkMode }) => {
    const token = localStorage.getItem('token');
    const [soldItems, setSoldItems] = useState([]);
    const [boughtItems, setBoughtItems] = useState([]);
  useEffect(() => {
    const fetchItems = async () => {
      if (!token || !user) return;

      try {
        // console.log(user.soldItems);
        // console.log(user.boughtItems);
        
        // Fetch sold items details
        if (user.soldItems && user.soldItems.length > 0) {
          const soldPromises = user.soldItems.map(itemId =>
            axios.get(`http://localhost:3000/v1/items/${itemId}`, {
              headers: { 'x-auth-token': token }
            })
          );
          const soldResponses = await Promise.all(soldPromises);
          setSoldItems(soldResponses.map(res => res.data));
        }

        // Fetch bought items details 
        if (user.boughtItems && user.boughtItems.length > 0) {
          const boughtPromises = user.boughtItems.map(itemId =>
            axios.get(`http://localhost:3000/v1/items/${itemId}`, {
              headers: { 'x-auth-token': token }
            })
          );
          const boughtResponses = await Promise.all(boughtPromises);
          setBoughtItems(boughtResponses.map(res => res.data));
        }
      } catch (err) {
        console.error('Error fetching user items:', err);
      }
    };

    fetchItems();
  }, []);
  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center mb-3">
            <Home className={`mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
            <h3 className="text-lg font-semibold">Dashboard Overview</h3>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Buy and sell cars with ease and let Dave, your personal AI assistant, guide you every step of the way.
            </p>
        </div>
        
        <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center mb-3">
            <Activity className={`mr-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} size={24} />
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <ul className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>• Add new Cars to sell</li>
            <li>• Browse Car listings</li>
            <li>• Have a chat with Dave</li>
            <li>• Negotiate prices with Dave</li>
            </ul>
        </div>

        
        <div className={`col-span-3 mt-4 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                {user.image ? (
                  <img 
                    src={user.image} 
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 dark:text-blue-400 text-3xl font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2">{user.username}</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold mb-4">Selling Statistics</h4>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Items Sold: <span className="font-semibold">{soldItems.length}</span>
                </p>
                <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Value: <span className="font-semibold">${soldItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </p>
                {soldItems.length > 0 && (
                  <div className={`mt-4 p-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <p className="text-sm font-semibold mb-1">Last Item Sold:</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {soldItems[soldItems.length - 1].name} - ${soldItems[soldItems.length - 1].price}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold mb-4">Buying Statistics</h4>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Items Bought: <span className="font-semibold">{boughtItems.length}</span>
                </p>
                <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Value: <span className="font-semibold">${boughtItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </p>
                {boughtItems.length > 0 && (
                  <div className={`mt-4 p-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <p className="text-sm font-semibold mb-1">Last Item Bought:</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {boughtItems[boughtItems.length - 1].name} - ${boughtItems[boughtItems.length - 1].price}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;