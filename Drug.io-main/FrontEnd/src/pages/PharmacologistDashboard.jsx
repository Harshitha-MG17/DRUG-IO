import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, LogOut } from 'lucide-react';

const PharmacologistDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">
                        Pharmacologist Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">Safety Review & Combinations</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 border border-red-900 rounded-lg hover:bg-red-900/50 transition-all"
                >
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-8 bg-gradient-to-br from-emerald-900/20 to-gray-900 rounded-2xl border border-emerald-900/50 shadow-2xl"
                >
                    <div className="mb-6 bg-emerald-900/30 w-16 h-16 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="text-emerald-400 w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Safer Combinations Registry</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Manage the database of validated safe drug combinations. Add new entries, update risk scores, and review safety protocols.
                    </p>
                    <Link to="/safer-combinations" className="inline-flex items-center justify-center w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-900/20">
                        Manage Registry &rarr;
                    </Link>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-8 bg-gradient-to-br from-blue-900/20 to-gray-900 rounded-2xl border border-blue-900/50 shadow-2xl"
                >
                    <div className="mb-6 bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center">
                        <Database className="text-blue-400 w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Safety Analysis Logs</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Review system-wide prediction logs for potential adverse events and toxicity warnings flagged by AI.
                    </p>
                    <Link to="/history" className="inline-flex items-center justify-center w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-900/20">
                        View Safety Logs &rarr;
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default PharmacologistDashboard;
