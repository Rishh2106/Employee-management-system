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
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                {user.role === 'GLOBAL_ADMIN' && (
                    <form onSubmit={handleCreateAdmin} className="mb-6 flex flex-col md:flex-row gap-2 items-center">
                        <input
                            className="border rounded px-3 py-2"
                            type="text"
                            placeholder="New admin username"
                            value={adminUsername}
                            onChange={e => setAdminUsername(e.target.value)}
                            required
                        />
                        <input
                            className="border rounded px-3 py-2"
                            type="password"
                            placeholder="Password"
                            value={adminPassword}
                            onChange={e => setAdminPassword(e.target.value)}
                            required
                        />
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            type="submit"
                        >
                            Create Admin
                        </button>
                        {adminError && <span className="text-red-500 text-sm ml-2">{adminError}</span>}
                        {adminSuccess && <span className="text-green-600 text-sm ml-2">{adminSuccess}</span>}
                    </form>
                )}
                {loading ? <div>Loading...</div> : (
                    <table className="w-full text-left border">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Username</th>
                                <th className="border px-4 py-2">Role</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="border px-4 py-2">{user.username}</td>
                                    <td className="border px-4 py-2">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="p-1 border rounded"
                                            disabled={user.role === 'GLOBAL_ADMIN'}
                                        >
                                            <option value="EMPLOYEE">Employee</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="GLOBAL_ADMIN">Global Admin</option>
                                        </select>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button 
                                            onClick={() => handleDelete(user.id)} 
                                            className="text-red-600"
                                            disabled={user.role === 'GLOBAL_ADMIN'}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
} 