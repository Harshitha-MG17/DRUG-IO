import React, { useState, useEffect } from 'react';
import api from '../api/central';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, RefreshCw, Copy, Check, Lock, X } from 'lucide-react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'researcher' });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tempPassword, setTempPassword] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users/');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const generateRandomPassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, password: pass });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/', formData);
            setMessage('User created successfully');
            setTempPassword(formData.password);
            setModalTitle(`User Created: ${formData.name}`);
            setShowModal(true);
            setFormData({ name: '', email: '', password: '', role: 'researcher' });
            fetchUsers();
        } catch (error) {
            setMessage('Error creating user');
        }
    };

    const handleResetPassword = async (user) => {
        if (!window.confirm(`Are you sure you want to reset the password for ${user.name}?`)) return;
        try {
            const res = await api.post('/users/reset-password', { user_id: user._id });
            setTempPassword(res.data.temp_password);
            setModalTitle(`Password Reset: ${user.name}`);
            setShowModal(true);
        } catch (error) {
            console.error("Reset failed", error);
            alert("Failed to reset password");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tempPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 text-white">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Admin User Management</h2>

            {/* Create User Form */}
            <form onSubmit={handleCreateUser} className="mb-8 p-4 bg-gray-800 rounded">
                <h3 className="text-lg font-bold mb-3">Create New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="p-2 rounded bg-gray-700 border border-gray-600"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="p-2 rounded bg-gray-700 border border-gray-600"
                        required
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-cyan-500 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={generateRandomPassword}
                            className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                        >
                            <RefreshCw size={14} /> Generate
                        </button>
                    </div>
                    <select
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        className="p-2 rounded bg-gray-700 border border-gray-600"
                    >
                        <option value="researcher">Researcher</option>
                        <option value="pharmacologist">Pharmacologist</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500">Create User</button>
                {message && <p className="mt-2 text-sm text-green-400">{message}</p>}
            </form>

            <h3 className="text-lg font-bold mb-3">Existing Users</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-700 text-gray-400">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Role</th>
                            <th className="p-2">Security</th>
                            <th className="p-2">Created At</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800">
                                <td className="p-2">{user.name}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2 capitalize text-cyan-400">{user.role}</td>
                                <td className="p-2">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Lock size={14} />
                                        <span>••••••••</span>
                                    </div>
                                </td>
                                <td className="p-2 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleResetPassword(user)}
                                        className="px-3 py-1 text-xs bg-red-900/30 text-red-400 border border-red-900/50 rounded hover:bg-red-900/50 transition-colors"
                                    >
                                        Reset Password
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Success/Reset Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-800 border border-gray-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">{modalTitle}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <p className="text-gray-400 mb-2 text-sm">Temporary Password:</p>
                            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex items-center justify-between group">
                                <code className="text-xl font-mono text-cyan-400 tracking-wider">
                                    {tempPassword}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 rounded-lg bg-gray-800 text-gray-400 group-hover:text-white group-hover:bg-gray-700 transition-all active:scale-95"
                                    title="Copy Password"
                                >
                                    {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                                </button>
                            </div>

                            <p className="mt-4 text-xs text-yellow-500/80 bg-yellow-900/10 p-2 rounded border border-yellow-500/10">
                                ⚠ Copy this password now. It will not be shown again.
                            </p>

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full mt-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-colors"
                            >
                                Done
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPanel;
