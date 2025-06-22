import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = user.role === 'ADMIN' ? '/tasks' : `/tasks/user/${user.id}`;
    apiRequest(url)
      .then(setTasks)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await apiRequest(`/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (e) {
      alert('Failed to delete task: ' + e.message);
    }
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === 'COMPLETED' ? 'NEW' : 'COMPLETED';
    try {
      await apiRequest(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: newStatus,
          userId: user.id,
          role: user.role,
        }),
      });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (e) {
      alert('Failed to update status: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tasks</h2>
          {user.role === 'ADMIN' && (
            <Link to="/tasks/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Task</Link>
          )}
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : tasks.length === 0 ? (
          <div>No tasks found.</div>
        ) : (
          <>
            {user.role === 'EMPLOYEE' && tasks.some(task => task.project && task.project.active === false) && (
              <div className="text-red-600 mb-4">One or more of your projects has been removed. You can't work on those tasks anymore.</div>
            )}
            <table className="w-full text-left border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Title</th>
                  <th className="border px-2 py-1">Description</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Assigned To</th>
                  <th className="border px-2 py-1">Start Date</th>
                  <th className="border px-2 py-1">Deadline</th>
                  <th className="border px-2 py-1">Project</th>
                  {user.role === 'ADMIN' && <th className="border px-2 py-1">Actions</th>}
                  {user.role === 'EMPLOYEE' && <th className="border px-2 py-1">Mark as Done</th>}
                </tr>
              </thead>
              <tbody>
                {tasks.filter(task => !task.project || task.project.active !== false).map(task => (
                  <tr key={task.id}>
                    <td className="border px-2 py-1">{task.title}</td>
                    <td className="border px-2 py-1">{task.description}</td>
                    <td className="border px-2 py-1">{task.status}</td>
                    <td className="border px-2 py-1">{task.assignedTo?.map(u => u.username).join(', ') || '-'}</td>
                    <td className="border px-2 py-1">{task.startDate || '-'}</td>
                    <td className="border px-2 py-1">{task.deadline || '-'}</td>
                    <td className="border px-2 py-1">{task.project?.name || '-'}</td>
                    {user.role === 'ADMIN' && (
                      <td className="border px-2 py-1">
                        <Link to={`/tasks/${task.id}/edit`} className="text-blue-600 mr-2">Edit</Link>
                        <button onClick={() => handleDelete(task.id)} className="text-red-600">Delete</button>
                      </td>
                    )}
                    {user.role === 'EMPLOYEE' && user.id === (task.assignedTo?.find(u => u.id === user.id)?.id) && (
                      <td className="border px-2 py-1">
                        <button
                          onClick={() => handleStatusToggle(task)}
                          className={`px-2 py-1 rounded ${task.status === 'COMPLETED' ? 'bg-gray-400 text-white' : 'bg-green-600 text-white'}`}
                        >
                          {task.status === 'COMPLETED' ? 'Mark as Not Done' : 'Mark as Done'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <div className="mt-4">
          <button onClick={() => navigate('/dashboard')} className="text-blue-600">Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
} 