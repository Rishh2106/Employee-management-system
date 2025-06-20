import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

export default function TaskForm({ editMode }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('NEW');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (user.role === 'ADMIN') {
      apiRequest('/users')
        .then(setUsers)
        .catch(() => setUsers([]));
    }
    if (editMode && id) {
      apiRequest(`/tasks/${id}`)
        .then(task => {
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
          setAssignedTo(task.assignedTo?.id || '');
        })
        .catch(() => {});
    }
  }, [editMode, id, user.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        title,
        description,
        status,
        assignedTo: assignedTo ? { id: assignedTo } : null,
      };
      if (editMode && id) {
        await apiRequest(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiRequest('/tasks', { method: 'POST', body: JSON.stringify(payload) });
      }
      setSuccess(true);
      setTimeout(() => navigate('/tasks'), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{editMode ? 'Edit Task' : 'New Task'}</h2>
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full mb-4 px-3 py-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        {user.role === 'ADMIN' && (
          <select
            className="w-full mb-4 px-3 py-2 border rounded"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            required
          >
            <option value="">Assign to...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        )}
        {editMode && (
          <select
            className="w-full mb-4 px-3 py-2 border rounded"
            value={status}
            onChange={e => setStatus(e.target.value)}
            required
          >
            <option value="NEW">NEW</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="FAILED">FAILED</option>
          </select>
        )}
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? (editMode ? 'Saving...' : 'Creating...') : (editMode ? 'Save' : 'Create')}
        </button>
        {success && <div className="text-green-600 mt-2 text-sm">Success! Redirecting...</div>}
        <div className="mt-4">
          <button type="button" onClick={() => navigate('/tasks')} className="text-blue-600">Back to Tasks</button>
        </div>
      </form>
    </div>
  );
} 