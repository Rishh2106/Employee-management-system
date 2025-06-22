import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

export default function TaskForm({ editMode }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('NEW');
  const [assignedTo, setAssignedTo] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');

  useEffect(() => {
    if (user.role !== 'EMPLOYEE') {
      apiRequest('/projects')
        .then(setProjects)
        .catch(() => {});
    }
    if (editMode && id) {
      apiRequest(`/tasks/${id}`)
        .then(task => {
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
          setAssignedTo(task.assignedTo?.map(u => u.id) || []);
          setTaskAssignedTo(task.assignedTo?.map(u => u.id) || []);
          setStartDate(task.startDate || '');
          setDeadline(task.deadline || '');
          setSelectedProject(task.project?.id || '');
        })
        .catch(() => {});
    }
  }, [editMode, id, user.role]);

  useEffect(() => {
    if (selectedProject) {
      const project = projects.find(p => p.id === Number(selectedProject));
      setUsers(project ? project.employees : []);
    } else {
      setUsers([]);
    }
  }, [selectedProject, projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        title,
        description,
        assignedTo: assignedTo.map(id => ({ id })),
        userId: user.id,
        role: user.role,
      };
      if (user.role === 'ADMIN') {
        payload.startDate = startDate;
        payload.deadline = deadline;
        payload.status = status;
      } else if (editMode && user.id === taskAssignedTo) {
        payload.status = status;
      }
      if (selectedProject) {
        payload.project = { id: selectedProject };
      }
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
          disabled={user.role !== 'ADMIN'}
        />
        <textarea
          className="w-full mb-4 px-3 py-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={user.role !== 'ADMIN'}
        />
        {user.role !== 'EMPLOYEE' && (
          <>
            <select
              className="w-full mb-4 px-3 py-2 border rounded"
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              required
            >
              <option value="">Select a Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input
              className="w-full mb-4 px-3 py-2 border rounded"
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
            <input
              className="w-full mb-4 px-3 py-2 border rounded"
              type="date"
              placeholder="Deadline"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              required
            />
          </>
        )}
        {user.role !== 'EMPLOYEE' && (
          <>
            <label className="block mb-1 font-medium" htmlFor="assignedTo-multi">
              Assign to (hold Ctrl/Cmd to select multiple):
              <input type="checkbox" checked readOnly className="ml-2 align-middle" style={{ pointerEvents: 'none' }} />
              <span className="ml-1 text-xs text-gray-500">Multi-select enabled</span>
            </label>
            <select
              id="assignedTo-multi"
              className="w-full mb-4 px-3 py-2 border rounded"
              value={assignedTo}
              onChange={e => setAssignedTo(Array.from(e.target.selectedOptions, option => option.value))}
              multiple
              required
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </>
        )}
        {editMode && ((user.role === 'ADMIN') || (user.id === taskAssignedTo)) && (
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