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
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

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

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const fetchTasks = () => {
    setLoading(true);
    setError(null);
    const url = user.role === 'ADMIN' ? '/tasks' : `/tasks/user/${user.id}`;
    apiRequest(url)
      .then(setTasks)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Tasks</h2>
          {(user.role === 'ADMIN' || user.role === 'GLOBAL_ADMIN') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 font-semibold transition"
            >
              + New Task
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Deadline</th>
                {(user.role === 'ADMIN' || user.role === 'GLOBAL_ADMIN') && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-semibold text-blue-900">{task.title}</td>
                  <td className="px-6 py-4 text-gray-700">{task.project?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {task.assignedUsers && task.assignedUsers.map((u) => (
                        <span key={u.id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{u.username}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.done ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Done</span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}</td>
                  {(user.role === 'ADMIN' || user.role === 'GLOBAL_ADMIN') && (
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 font-semibold transition"
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 font-semibold transition"
                      >Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showForm && (
          <TaskForm
            onClose={() => setShowForm(false)}
            onSave={fetchTasks}
            editTask={editTask}
          />
        )}
      </div>
    </div>
  );
} 