import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

export default function UserList() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminError, setAdminError] = useState(null);
    const [adminSuccess, setAdminSuccess] = useState(null);

    const fetchUsers = () => {
        apiRequest('/users')
            .then(setUsers)
            .finally(() => setLoading(false));
    };

    useEffect(fetchUsers, []);

    const handleRoleChange = async (userId, role) => {
        await apiRequest(`/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
        fetchUsers();
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Delete this user?')) return;
        await apiRequest(`/users/${userId}`, { method: 'DELETE' });
        fetchUsers();
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setAdminError(null);
        setAdminSuccess(null);
        try {
            await apiRequest('/users/create-admin', {
                method: 'POST',
                body: JSON.stringify({ username: adminUsername, password: adminPassword }),
            });
            setAdminSuccess('Admin user created!');
            setAdminUsername('');
            setAdminPassword('');
            fetchUsers();
        } catch (err) {
            let msg = err.message;
            try {
                const parsed = JSON.parse(msg);
                msg = parsed.error || msg;
            } catch {}
            setAdminError(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Projects</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50 transition">
                                    <td className="px-6 py-4 font-semibold text-blue-900">{user.username}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.role === 'GLOBAL_ADMIN' ? 'bg-purple-100 text-purple-700' : user.role === 'ADMIN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {user.projects && user.projects.map((p) => (
                                                <span key={p.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{p.name}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 font-semibold transition"
                                        >Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 