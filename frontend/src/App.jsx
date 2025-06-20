import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function Navigation() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link to="/" className="font-bold mr-4">Ewspurp EMS</Link>
        {user && <Link to="/dashboard" className="mr-4">Dashboard</Link>}
        {user && <Link to="/tasks" className="mr-4">Tasks</Link>}
      </div>
      <div>
        {!user && <Link to="/login" className="mr-4">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>}
      </div>
    </nav>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
      <Route path="/tasks/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
      <Route path="/tasks/:id/edit" element={<PrivateRoute><TaskForm editMode /></PrivateRoute>} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
} 