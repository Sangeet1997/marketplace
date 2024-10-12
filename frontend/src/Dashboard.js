import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to log out the user
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token
    navigate('/login'); // Redirect to the login page
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token found
      } else {
        try {
          // Decode the token to get user ID
          const decoded = jwtDecode(token);
          
          // Make a request to get user details
          const res = await axios.get(`http://localhost:3000/v1/auth/user/${decoded.id}`, {
            headers: { 'x-auth-token': token },
          });
          setUser(res.data); // Set user data
        } catch (err) {
          console.error('Error fetching user data:', err);
          navigate('/login'); // Redirect to login on error
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
