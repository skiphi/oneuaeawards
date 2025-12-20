import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import './App.css';

// Main App using Router
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

const AppRoutes = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const login = () => {
    setIsAdmin(true);
    navigate('/dashboard');
  };

  const logout = () => {
    setIsAdmin(false);
    navigate('/admin');
  };

  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/admin" element={<AdminLogin onLogin={login} />} />
      <Route path="/dashboard" element={isAdmin ? <Dashboard onLogout={logout} /> : <Navigate to="/admin" />} />
    </Routes>
  );
}

export default App;

