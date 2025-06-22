import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full border border-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">Welcome, {user.username}!</h2>
        <p className="mb-6 text-lg">Role: <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm uppercase tracking-wide">{user.role}</span></p>
        <div className="mb-6 flex flex-col gap-4">
          <Link to="/tasks" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 font-semibold transition">View Tasks</Link>
          {user.role === 'ADMIN' || user.role === 'GLOBAL_ADMIN' ? (
            <Link to="/projects" className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 font-semibold transition">Manage Projects</Link>
          ) : null}
          {user.role === 'GLOBAL_ADMIN' && (
            <Link to="/users" className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 font-semibold transition">User Management</Link>
          )}
        </div>
        <button
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 font-semibold transition"
          onClick={logout}
        >Logout</button>
      </div>
    </div>
  );
} 