import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FrequentlyUsedDrugs from '../components/FrequentlyUsedDrugs';
import { Activity, Clock, LogOut, Beaker } from 'lucide-react';

const ResearcherDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                        Researcher Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">Welcome back, {user?.name}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 border border-red-900 rounded-lg hover:bg-red-900/50 transition-all"
                >
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
                {/* New Prediction Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-xl"
                >
                    <div className="bg-cyan-900/30 p-3 rounded-full w-fit mb-4">
                        <Beaker className="text-cyan-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">New Prediction</h3>
                    <p className="text-gray-400 mb-6 text-sm">Run ADMET, DTI, and Synergy predictions using our AI models.</p>
                    <Link to="/predict" className="inline-flex items-center justify-center w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold transition-all">
                        Start Analysis &rarr;
                    </Link>
                </motion.div>

                {/* Work History Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-xl"
                >
                    <div className="bg-purple-900/30 p-3 rounded-full w-fit mb-4">
                        <Clock className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400 mb-2">Work History</h3>
                    <p className="text-gray-400 mb-6 text-sm">View and analyze your past drug discovery queries.</p>
                    <Link to="/history" className="inline-flex items-center justify-center w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-all">
                        View History &rarr;
                    </Link>
                </motion.div>

                {/* System Stats (Placeholder) */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-xl opacity-80"
                >
                    <div className="bg-green-900/30 p-3 rounded-full w-fit mb-4">
                        <Activity className="text-green-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">System Status</h3>
                    <p className="text-gray-400 mb-6 text-sm">All AI services are online and operational.</p>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-green-400">Operational</span>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <FrequentlyUsedDrugs />
            </motion.div>
        </div>
    );
};

export default ResearcherDashboard;
