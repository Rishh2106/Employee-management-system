import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import ProjectDetail from './components/ProjectDetail';
import UserList from './components/UserList';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && (user.role === 'ADMIN' || user.role === 'GLOBAL_ADMIN') ? children : <Navigate to="/dashboard" />;
}

function GlobalAdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === 'GLOBAL_ADMIN' ? children : <Navigate to="/dashboard" />;
}

function Navigation() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link to="/" className="font-bold mr-4">Ewspurp EMS</Link>
        {user && <Link to="/dashboard" className="mr-4">Dashboard</Link>}
        {user && <Link to="/tasks" className="mr-4">Tasks</Link>}
        {user && user.role !== 'EMPLOYEE' && <Link to="/projects" className="mr-4">Projects</Link>}
        {user && user.role === 'GLOBAL_ADMIN' && <Link to="/users" className="mr-4">Users</Link>}
      </div>
      <div>
        {!user && <Link to="/login" className="mr-4">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>}
      </div>
    </nav>
  );
}

function SetupGlobalAdmin() {
  const [exists, setExists] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/users/global-admin-exists')
      .then(res => res.json())
      .then(setExists);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users/setup-global-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (exists === null) return <div className="min-h-screen flex items-center justify-center">Checking...</div>;
  if (exists) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Setup Global Admin</h2>
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Setting up...' : 'Setup'}
        </button>
        {success && <div className="text-green-600 mt-2 text-sm">Global admin created! Redirecting to login...</div>}
      </form>
    </div>
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
      <Route path="/projects" element={<AdminRoute><ProjectList /></AdminRoute>} />
      <Route path="/projects/new" element={<AdminRoute><ProjectForm /></AdminRoute>} />
      <Route path="/projects/:id" element={<AdminRoute><ProjectDetail /></AdminRoute>} />
      <Route path="/projects/:id/edit" element={<AdminRoute><ProjectForm editMode /></AdminRoute>} />
      <Route path="/users" element={<GlobalAdminRoute><UserList /></GlobalAdminRoute>} />
      <Route path="/setup-global-admin" element={<SetupGlobalAdmin />} />
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