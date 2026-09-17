import React, { useEffect, useState } from 'react';
import api from '../api/central';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SaferDrugCombinations = () => {
    const { user } = useAuth();
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ drug_a: '', drug_b: '', risk_score: 0, notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCombos = async () => {
        try {
            const res = await api.get('/safety/combinations');
            setCombos(res.data);
        } catch (err) {
            console.error("Failed to fetch combinations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/safety/combinations', formData);
            setFormData({ drug_a: '', drug_b: '', risk_score: 0, notes: '' });
            await fetchCombos();
        } catch (err) {
            alert('Failed to add combination');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPharmacologist = user?.role === 'pharmacologist' || user?.role === 'admin';

    if (loading) return <p className="text-gray-400">Loading combinations...</p>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`${isPharmacologist ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                <h3 className="text-xl font-bold mb-4 text-white">Known Safer Combinations</h3>

                {combos.length === 0 ? (
                    <p className="text-gray-500">No combinations recorded yet.</p>
                ) : (
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-800 text-gray-200 uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-3">Combination</th>
                                    <th className="px-4 py-3">Risk Score</th>
                                    <th className="px-4 py-3">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {combos.map((c, idx) => (
                                    <motion.tr
                                        key={c._id || idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-gray-800/50"
                                    >
                                        <td className="px-4 py-3 font-medium text-white">
                                            {c.drug_a} + {c.drug_b}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${c.risk_score <= 3 ? 'bg-green-900 text-green-300' :
                                                    c.risk_score <= 7 ? 'bg-yellow-900 text-yellow-300' :
                                                        'bg-red-900 text-red-300'
                                                }`}>
                                                {c.risk_score}/10
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate" title={c.notes}>
                                            {c.notes || '-'}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isPharmacologist && (
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 bg-gray-900 rounded-xl border border-gray-700 sticky top-4"
                    >
                        <h3 className="text-xl font-bold mb-4 text-green-400">Add New Combination</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Drug A</label>
                                <input
                                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:border-green-500 outline-none transition-colors"
                                    value={formData.drug_a}
                                    onChange={e => setFormData({ ...formData, drug_a: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Drug B</label>
                                <input
                                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:border-green-500 outline-none transition-colors"
                                    value={formData.drug_b}
                                    onChange={e => setFormData({ ...formData, drug_b: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Risk Score (0-10)</label>
                                <input
                                    type="number" min="0" max="10"
                                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:border-green-500 outline-none transition-colors"
                                    value={formData.risk_score}
                                    onChange={e => setFormData({ ...formData, risk_score: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Safety Notes</label>
                                <textarea
                                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:border-green-500 outline-none transition-colors h-24 resize-none"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                            <button
                                disabled={isSubmitting}
                                className="w-full py-2 bg-green-600 rounded font-bold hover:bg-green-500 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Adding...' : 'Add Combination'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SaferDrugCombinations;
