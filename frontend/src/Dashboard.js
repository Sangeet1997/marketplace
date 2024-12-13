import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Sun, Moon, Package, Users, TagIcon, LogOut, Info, Mail } from 'lucide-react';
import UserList from './components/UserList';
import AddItemForm from './components/AddItemForm';
import ProductList from './components/ProductList';
import Chatbot from './components/Chatbot';
import AboutUs from './components/AboutUs';
import Resizer from 'react-image-file-resizer';
import Welcome from './components/Welcome';


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();
  const [showProductList, setShowProductList] = useState(false);
  const [showSellTab, setShowSellTab] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

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
          // console.log(res.data);
          if (res.data.image) {
            setProfilePic(res.data.image);
          } else {
            setProfilePic('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4Qm+aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+IDxkYzpjcmVhdG9yPiA8cmRmOlNlcT4gPHJkZjpsaT5WZWN0b3JTdG9jay5jb20vMjExMDUyNDY8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2RjOmNyZWF0b3I+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/2wBDAAQDAwMDAgQDAwMEBAQFBgoGBgUFBgwICQcKDgwPDg4MDQ0PERYTDxAVEQ0NExoTFRcYGRkZDxIbHRsYHRYYGRj/wAALCAH0AfQBAREA/8QAHAABAAMBAQEBAQAAAAAAAAAAAAMEBQIIBwYB/8QASxAAAAQDBQUGBgIBAgQCBwkAAAECAwQREhQxNIGhBRNBUrEGIiMkY6IHIUJDYWJRcTIIkXKCksEVsxcYJTNEg/A2N5OV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');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const toggleAboutUs = () => {
    setIsAboutUsOpen(!isAboutUsOpen);
  };

  const handleProfilePic = () => {
    const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';

  fileInput.onchange = async (e) => {
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
          axios.post('http://localhost:3000/v1/auth/user/update-image', { image: uri }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
          setProfilePic(uri);
        },
        'base64'
      );
    }
  };

  fileInput.click();
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <nav className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FairTrader AI</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm">
              </span>
            )}
            <button
              onClick={() => window.location.href = 'mailto:sangeet1116saha@gmail.com'}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <Mail size={20} />
            </button>
            <button
              onClick={toggleAboutUs}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <Info size={20} />
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
                  onClick={handleLogout}
                  className="flex items-center justify-center p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {user ? (
          <div className="space-y-6">
            <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? 'bg-dark-bg'  : 'bg-light-bg'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <img src={profilePic} alt="User" className="w-20 h-20 rounded-full m-3" onClick={handleProfilePic} />
                  <h2 className="text-xl font-semibold mb-2 m-3">{user.username}</h2>
                  {/* <p className="text-sm">Email: {user.email}</p> */}
                </div>
                
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
              {!showProductList && !showSellTab && !showUserList && <Welcome user={user} isDarkMode={isDarkMode} />}
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
      {isChatbotOpen && <Chatbot 
        onClose={toggleChatbot}
        aboutUsOpen={setIsAboutUsOpen}
        handleProductButton={handleProductButton}
        handleSellButton={handleSellButton}
        handleUserButton={handleUserButton}
      />}

      {/* Floating Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 z-51"
      >
        💬
      </button>
      <AboutUs 
        isOpen={isAboutUsOpen} 
        onClose={toggleAboutUs} 
        isDarkMode={isDarkMode} 
      />
    </div>
  );
};

export default Dashboard;