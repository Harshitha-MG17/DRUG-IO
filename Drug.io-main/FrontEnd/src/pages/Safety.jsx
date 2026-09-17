import React, { useEffect, useState } from 'react';
import api from '../api/central';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Safety = () => {
    const { user } = useAuth();
    const [combos, setCombos] = useState([]);
    const [formData, setFormData] = useState({ drug_a: '', drug_b: '', risk_score: 0, notes: '' });

    useEffect(() => {
        api.get('/safety/').then(res => setCombos(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/safety/', formData);
            setFormData({ drug_a: '', drug_b: '', risk_score: 0, notes: '' });
            const res = await api.get('/safety/');
            setCombos(res.data);
        } catch (err) {
            alert('Failed to add combination');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <Link to="/dashboard" className="text-gray-400 hover:text-white mb-4 inline-block">&larr; Back to Dashboard</Link>
            <h2 className="text-3xl font-bold mb-6 text-green-400">Safer Drug Combinations</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Known Combinations</h3>
                    {combos && combos.length > 0 ? (
                        <div className="space-y-3">
                            {combos.map((c, idx) => (
                                <motion.div
                                    key={c._id || idx}
                                    className="p-4 bg-gray-900 rounded border border-gray-800"
                                >
                                    <div className="flex justify-between font-bold">
                                        <span>{c.drug_a || 'Unknown'} + {c.drug_b || 'Unknown'}</span>
                                        <span className={(c.risk_score || 0) > 5 ? 'text-red-400' : 'text-green-400'}>
                                            Risk: {c.risk_score !== undefined ? c.risk_score : 'N/A'}/10
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2">{c.notes || 'No notes available.'}</p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No combinations record found.</p>
                    )}
                </div>

                {['pharmacologist', 'admin'].includes(user?.role) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-gray-900 rounded-xl border border-gray-700 h-fit">
                        <h3 className="text-xl font-bold mb-4">Add New Combination</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input placeholder="Drug A" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
                                value={formData.drug_a} onChange={e => setFormData({ ...formData, drug_a: e.target.value })} required />
                            <input placeholder="Drug B" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
                                value={formData.drug_b} onChange={e => setFormData({ ...formData, drug_b: e.target.value })} required />
                            <input type="number" placeholder="Risk Score (0-10)" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
                                value={formData.risk_score} onChange={e => setFormData({ ...formData, risk_score: parseInt(e.target.value) })} required />
                            <textarea placeholder="Safety Notes" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
                                value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            <button className="w-full py-2 bg-green-600 rounded font-bold hover:bg-green-500">Add Combination</button>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Safety;
