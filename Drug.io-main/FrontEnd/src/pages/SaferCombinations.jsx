import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/central';
import { motion } from 'framer-motion';
import { Shield, Plus, Save, Trash2, Search } from 'lucide-react';

const SaferCombinations = () => {
    const { user } = useAuth();
    const [combinations, setCombinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // New entry form state
    const [newCombo, setNewCombo] = useState({ drug_a: '', drug_b: '', risk_score: 0.1, notes: '' });

    useEffect(() => {
        fetchCombinations();
    }, []);

    const fetchCombinations = async () => {
        try {
            const res = await api.get('/safety/combinations');
            setCombinations(res.data);
        } catch (err) {
            console.error("Failed to load safer combinations");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/safety/combinations', newCombo);
            setNewCombo({ drug_a: '', drug_b: '', risk_score: 0.1, notes: '' });
            fetchCombinations();
        } catch (err) {
            alert('Failed to add combination');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/safety/combinations/${id}`);
            fetchCombinations();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const filtered = combinations.filter(c =>
        c.drug_a.toLowerCase().includes(search.toLowerCase()) ||
        c.drug_b.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
            <header className="mb-10">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 mb-2">
                    Safer Drug Combinations Registry
                </h1>
                <p className="text-gray-400">Validated low-risk interactions for clinical reference.</p>
            </header>

            {/* Add New - Only for Pharmacologist */}
            {user?.role === 'pharmacologist' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-800"
                >
                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <Plus size={20} /> Add New Safe Combination
                    </h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <input
                            placeholder="Drug A"
                            className="bg-gray-800 border-gray-700 p-2 rounded text-white"
                            value={newCombo.drug_a} onChange={e => setNewCombo({ ...newCombo, drug_a: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Drug B"
                            className="bg-gray-800 border-gray-700 p-2 rounded text-white"
                            value={newCombo.drug_b} onChange={e => setNewCombo({ ...newCombo, drug_b: e.target.value })}
                            required
                        />
                        <input
                            type="number" step="0.01" min="0" max="1"
                            placeholder="Risk Score (0-1)"
                            className="bg-gray-800 border-gray-700 p-2 rounded text-white"
                            value={newCombo.risk_score} onChange={e => setNewCombo({ ...newCombo, risk_score: parseFloat(e.target.value) })}
                        />
                        <input
                            placeholder="Safety Notes"
                            className="bg-gray-800 border-gray-700 p-2 rounded text-white"
                            value={newCombo.notes} onChange={e => setNewCombo({ ...newCombo, notes: e.target.value })}
                        />
                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded flex items-center justify-center gap-2 transition-all">
                            <Save size={18} /> Add
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Search */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                    className="w-full bg-gray-900 border border-gray-800 p-3 pl-10 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Search registry..."
                    value={search} onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Registry List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? <p>Loading registry...</p> : filtered.map((combo) => (
                    <motion.div
                        key={combo._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-emerald-900 transition-all flex justify-between items-center group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-900/20 p-3 rounded-full">
                                <Shield className="text-emerald-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">
                                    {combo.drug_a} <span className="text-gray-500">+</span> {combo.drug_b}
                                </h3>
                                <p className="text-sm text-gray-400">{combo.notes || "No additional notes."}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase">Risk Score</p>
                                <p className={`font-bold ${combo.risk_score < 0.3 ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {combo.risk_score}
                                </p>
                            </div>
                            {user?.role === 'pharmacologist' && (
                                <button
                                    onClick={() => handleDelete(combo._id)}
                                    className="p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
                {!loading && filtered.length === 0 && (
                    <p className="text-gray-500 text-center py-10">No combinations found matching your search.</p>
                )}
            </div>
        </div>
    );
};

export default SaferCombinations;
