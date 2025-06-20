import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h2>
        <p className="mb-4">Role: <span className="font-semibold">{user.role}</span></p>
        <div className="mb-4">
          <Link to="/tasks" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">View Tasks</Link>
          {user.role === 'ADMIN' && (
            <Link to="/tasks/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Task</Link>
          )}
        </div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={logout}
        >Logout</button>
      </div>
    </div>
  );
} 