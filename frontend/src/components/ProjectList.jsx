import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ProjectList() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Projects</h2>
                    {user.role !== 'EMPLOYEE' && (
                        <Link to="/projects/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Project</Link>
                    )}
                </div>
                {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
                    <table className="w-full text-left border">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2">Employees</th>
                                {user.role !== 'EMPLOYEE' && <th className="border px-4 py-2">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project.id}>
                                    <td className="border px-4 py-2">{project.name}</td>
                                    <td className="border px-4 py-2">{project.description}</td>
                                    <td className="border px-4 py-2">{project.employees.length}</td>
                                    {user.role !== 'EMPLOYEE' && (
                                        <td className="border px-4 py-2">
                                            <Link to={`/projects/${project.id}`} className="text-blue-600 mr-2">View</Link>
                                            <Link to={`/projects/${project.id}/edit`} className="text-green-600 mr-2">Edit</Link>
                                            <button onClick={() => handleDelete(project.id)} className="text-red-600">Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
} 