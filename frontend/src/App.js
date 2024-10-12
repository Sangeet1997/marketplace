import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Check if token is expired
    } catch (e) {
      return false;
    }
  }
  return false;
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
    </Routes>
  </Router>
);

export default App;
