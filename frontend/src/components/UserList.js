import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';
import UserCard from './UserCard.js';


function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/v1/auth/users', {
      headers: { 'x-auth-token': token },
    })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching users');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Users className="w-6 h-6" />
        Registered Users
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard key={user._id} username={user.username} email={user.email} image={user.image} soldItems={user.soldItems} boughtItems={user.boughtItems} />
        ))}
      </div>
    </div>
  );
}

export default UserList;