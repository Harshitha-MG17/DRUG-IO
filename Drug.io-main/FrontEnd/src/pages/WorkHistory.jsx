import React, { useEffect, useState } from 'react';
import api from '../api/central';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import WorkHistoryList from '../components/WorkHistoryList';
import FrequentlyUsedDrugs from '../components/FrequentlyUsedDrugs';
import SaferDrugCombinations from '../components/SaferDrugCombinations';

const WorkHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('history');

    useEffect(() => {
        const fetchHistory = async () => {
            // Only fetch history if we represent it, but to keep existing behavior efficient,
            // we can cache or just fetch on mount.
            // For now, we fetch on mount as per original logic.
            try {
                const res = await api.get('/work/history');
                setHistory(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load history. Please ensure the backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const tabs = [
        { id: 'history', label: 'Work History' },
        { id: 'frequent', label: 'Frequently Used Drugs' },
        { id: 'safety', label: 'Safer Drug Combinations' }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <Link to="/dashboard" className="text-gray-400 hover:text-white mb-4 inline-block">&larr; Back to Dashboard</Link>
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Work Tracking</h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-800">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-2 px-4 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="underline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div>
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        {error && (
                            <div className="mb-4 bg-red-900/20 p-4 rounded border border-red-900 text-red-400">
                                {error}
                            </div>
                        )}
                        {loading ? <p>Loading history...</p> : <WorkHistoryList history={history} />}
                    </div>
                )}

                {activeTab === 'frequent' && (
                    <FrequentlyUsedDrugs />
                )}

                {activeTab === 'safety' && (
                    <SaferDrugCombinations />
                )}
            </div>
        </div>
    );
};

export default WorkHistory;
