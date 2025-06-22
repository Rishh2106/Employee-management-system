import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';
import ProjectForm from './ProjectForm';

export default function ProjectList() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editProject, setEditProject] = useState(null);

    useEffect(() => {
        apiRequest('/projects')
            .then(setProjects)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await apiRequest(`/projects/${id}`, { method: 'DELETE' });
            setProjects(projects.filter(p => p.id !== id));
        } catch (e) {
            alert('Failed to delete project: ' + e.message);
        }
    };

    const handleEdit = (project) => {
        setEditProject(project);
        setShowForm(true);
    };

    const fetchProjects = () => {
        apiRequest('/projects')
            .then(setProjects)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-blue-700">Projects</h2>
                    {(user.role === 'ADMIN' || user.role === 'GLOBAL_ADMIN') && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 font-semibold transition"
                        >
                            + New Project
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Members</th>
                                {(user.role === 'ADMIN' || user.role === 'GLOBAL_ADMIN') && <th className="px-6 py-3"></th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-blue-50 transition">
                                    <td className="px-6 py-4 font-semibold text-blue-900">{project.name}</td>
                                    <td className="px-6 py-4 text-gray-700">{project.description}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {project.users && project.users.map((u) => (
                                                <span key={u.id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{u.username}</span>
                                            ))}
                                        </div>
                                    </td>
                                    {(user.role === 'ADMIN' || user.role === 'GLOBAL_ADMIN') && (
                                        <td className="px-6 py-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 font-semibold transition"
                                            >Edit</button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
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
                    <ProjectForm
                        onClose={() => setShowForm(false)}
                        onSave={fetchProjects}
                        editProject={editProject}
                    />
                )}
            </div>
        </div>
    );
} 