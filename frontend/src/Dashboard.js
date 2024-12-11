import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Sun, Moon, Package, Users, TagIcon, LogOut } from 'lucide-react';
import UserList from './components/UserList';
import AddItemForm from './components/AddItemForm';
import ProductList from './components/ProductList';
import Chatbot from './components/Chatbot';


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();
  const [showProductList, setShowProductList] = useState(false);
  const [showSellTab, setShowSellTab] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProductButton = () => {
    setShowProductList(!showProductList);
    setShowSellTab(false);
    setShowUserList(false);
  };

  const handleSellButton = () => {
    setShowSellTab(!showSellTab);
    setShowProductList(false);
    setShowUserList(false);
  };

  const handleUserButton = () => {
    setShowUserList(!showUserList);
    setShowProductList(false);
    setShowSellTab(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      } else {
        try {
          const decoded = jwtDecode(token);
          const res = await axios.get(`http://localhost:3000/v1/auth/user/${decoded.id}`, {
            headers: { 'x-auth-token': token },
          });
          setUser(res.data);
        } catch (err) {
          console.error('Error fetching user data:', err);
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <nav className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm">
                Welcome, {user.username}
              </span>
            )}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {user ? (
          <div className="space-y-6">
            <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
                  <p className="text-sm">Email: {user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleProductButton}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg shadow-md transition-colors
                  ${isDarkMode
                    ? showProductList ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    : showProductList ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
                  }`}
              >
                <Package size={20} />
                <span>Product List</span>
              </button>

              <button
                onClick={handleSellButton}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg shadow-md transition-colors
                  ${isDarkMode
                    ? showSellTab ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    : showSellTab ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
                  }`}
              >
                <TagIcon size={20} />
                <span>Sell Item</span>
              </button>

              <button
                onClick={handleUserButton}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg shadow-md transition-colors
                  ${isDarkMode
                    ? showUserList ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    : showUserList ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
                  }`}
              >
                <Users size={20} />
                <span>User List</span>
              </button>
            </div>

            <div className={`mt-6 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {showProductList && <ProductList />}
              {showSellTab && <AddItemForm owner={user.username} />}
              {showUserList && <UserList />}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
      </main>
      {isChatbotOpen && <Chatbot onClose={toggleChatbot} />}

      {/* Floating Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
      >
        💬
      </button>
    </div>
  );
};

export default Dashboard;