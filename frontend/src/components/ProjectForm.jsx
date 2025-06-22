import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../api';

export default function ProjectForm({ editMode }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (editMode && id) {
            apiRequest(`/projects/${id}`)
                .then(project => {
                    setName(project.name);
                    setDescription(project.description);
                })
                .catch(e => setError(e.message));
        }
    }, [editMode, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const payload = { name, description };
        try {
            if (editMode && id) {
                await apiRequest(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
            } else {
                await apiRequest('/projects', { method: 'POST', body: JSON.stringify(payload) });
            }
            navigate('/projects');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">{editMode ? 'Edit Project' : 'New Project'}</h2>
                <input
                    className="w-full mb-4 px-3 py-2 border rounded"
                    type="text"
                    placeholder="Project Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <textarea
                    className="w-full mb-4 px-3 py-2 border rounded"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
} 