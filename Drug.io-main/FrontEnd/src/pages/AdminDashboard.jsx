import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Activity, LogOut } from 'lucide-react';
import api from '../api/central';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ users: 0, queries: 0 });

    useEffect(() => {
        // Fetch stats if API available, else mock or count from users list
        const fetchStats = async () => {
            try {
                const usersRes = await api.get('/users/');
                const queriesRes = await api.get('/work/history'); // Note: this gets history for *current user*. Admin might need a full system log.
                // Assuming AdminPanel fetches users, we can just display general info here.
                setStats({ users: usersRes.data.length, queries: 0 });
            } catch (error) {
                console.error("Stats error", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">System Management & User Control</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 border border-red-900 rounded-lg hover:bg-red-900/50 transition-all"
                >
                    <LogOut size={18} /> Logout
                </button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gray-900 rounded-xl border border-gray-800 flex items-center gap-4"
                >
                    <div className="bg-blue-900/30 p-4 rounded-full">
                        <Users className="text-blue-400 w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-gray-400 text-sm uppercase font-bold">Total Users</h3>
                        <p className="text-3xl font-bold text-white">{stats.users}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-gray-900 rounded-xl border border-gray-800 flex items-center gap-4"
                >
                    <div className="bg-green-900/30 p-4 rounded-full">
                        <Activity className="text-green-400 w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-gray-400 text-sm uppercase font-bold">System Status</h3>
                        <p className="text-xl font-bold text-green-400">Online</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-gray-900 rounded-xl border border-gray-800 flex items-center gap-4"
                >
                    <div className="bg-red-900/30 p-4 rounded-full">
                        <ShieldAlert className="text-red-400 w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-gray-400 text-sm uppercase font-bold">Security Alerts</h3>
                        <p className="text-3xl font-bold text-white">0</p>
                    </div>
                </motion.div>
            </div>

            {/* Admin Panel Component */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <AdminPanel />
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
