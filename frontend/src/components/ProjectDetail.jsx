import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
    const { user } = useAuth();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [error, setError] = useState(null);

    const fetchProject = () => {
        apiRequest(`/projects/${id}`)
            .then(setProject)
            .catch(e => setError(e.message));
    };

    useEffect(() => {
        fetchProject();
        if (user.role !== 'EMPLOYEE') {
            apiRequest('/users')
                .then(users => setAllUsers(users.filter(u => u.role === 'EMPLOYEE')))
                .catch(() => {});
        }
    }, [id, user.role]);

    const handleAddEmployee = async (userId) => {
        await apiRequest(`/projects/${id}/employees`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
        });
        fetchProject();
    };
    
    const handleRemoveEmployee = async (userId) => {
        await apiRequest(`/projects/${id}/employees/${userId}`, { method: 'DELETE' });
        fetchProject();
    };

    if (!project) return <div>Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    const projectEmployeeIds = project.employees.map(e => e.id);
    const usersToAdd = allUsers.filter(u => !projectEmployeeIds.includes(u.id));

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                <p className="mb-6">{project.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Team Members ({project.employees.length})</h3>
                        <ul>
                            {project.employees.map(employee => (
                                <li key={employee.id} className="flex justify-between items-center mb-2">
                                    {employee.username}
                                    {user.role !== 'EMPLOYEE' && (
                                        <button onClick={() => handleRemoveEmployee(employee.id)} className="text-red-600 text-xs">Remove</button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {user.role !== 'EMPLOYEE' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Add Employee</h3>
                            <select 
                                onChange={(e) => handleAddEmployee(e.target.value)}
                                className="w-full p-2 border rounded"
                                defaultValue=""
                            >
                                <option value="" disabled>Select an employee</option>
                                {usersToAdd.map(u => (
                                    <option key={u.id} value={u.id}>{u.username}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="mt-8">
                    <Link to="/projects" className="text-blue-600">Back to Projects</Link>
                </div>
            </div>
        </div>
    );
} 