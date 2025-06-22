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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={() => navigate('/tasks')}
        >&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">{editMode ? 'Edit Task' : 'Create Task'}</h2>
        {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            required
          />
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Assign Users</label>
            <select
              multiple
              value={assignedTo}
              onChange={e => setAssignedTo(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white h-32"
              required
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple users.</div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-semibold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-semibold">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition mt-2"
          >
            {editMode ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
} 