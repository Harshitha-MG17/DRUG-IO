import React, { useEffect, useState } from 'react';
import api from '../api/central';
import { motion } from 'framer-motion';

const FrequentlyUsedDrugs = () => {
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrugs = async () => {
            try {
                const res = await api.get('/work/frequent-drugs');
                setDrugs(res.data);
            } catch (error) {
                console.error("Failed to fetch frequent drugs");
            } finally {
                setLoading(false);
            }
        };
        fetchDrugs();
    }, []);

    if (loading) return <p className="text-gray-400">Loading frequent drugs...</p>;
    if (drugs.length === 0) return <p className="text-gray-500">No data available.</p>;

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-800 text-gray-200 uppercase font-medium">
                    <tr>
                        <th className="px-6 py-3">Drug (SMILES)</th>
                        <th className="px-6 py-3">Usage Count</th>
                        <th className="px-6 py-3">Last Used</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {drugs.map((drug, index) => (
                        <motion.tr
                            key={drug._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-800/50 transition-colors"
                        >
                            <td className="px-6 py-4 font-mono text-cyan-400 truncate max-w-xs" title={drug.smiles}>
                                {drug.smiles}
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                                    {drug.usage_count}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {drug.last_used ? new Date(drug.last_used).toLocaleDateString() : 'N/A'}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FrequentlyUsedDrugs;
