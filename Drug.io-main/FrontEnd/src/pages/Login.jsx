import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import MoleculeBackground from '../components/MoleculeBackground';

const Login = () => {
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await login(email, password);
            if (result.success || result === true) {
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-[#0a192f] text-white overflow-hidden font-sans">
            <MoleculeBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md p-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
                <div className="w-full h-full p-8 bg-[#0a192f]/40 rounded-[22px]">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 drop-shadow-sm">
                                Drug.io
                            </h2>
                            <div className="flex items-center justify-center gap-2 mt-3 opacity-90">
                                <span className="h-[1px] w-8 bg-cyan-500/50"></span>
                                <p className="text-cyan-100 text-xs font-bold uppercase tracking-[0.2em]">Next Gen Discovery</p>
                                <span className="h-[1px] w-8 bg-cyan-500/50"></span>
                            </div>
                        </motion.div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm text-center font-medium backdrop-blur-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-cyan-300/80 uppercase tracking-wider ml-1">Email Access</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-[#112240]/80 border border-cyan-900/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 outline-none transition-all placeholder-gray-500 text-white font-medium"
                                placeholder="researcher@drug.io"
                                required
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <label className="block text-xs font-bold text-cyan-300/80 uppercase tracking-wider ml-1">Secure Key</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#112240]/80 border border-cyan-900/30 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 outline-none transition-all placeholder-gray-500 text-white font-medium pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-500/60 hover:text-cyan-400 transition-colors focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(100, 255, 218, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            type="submit"
                            className={`w-full py-4 mt-4 font-bold rounded-xl shadow-lg transition-all tracking-wide text-sm uppercase ${isLoading
                                ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                                : 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-500 hover:to-teal-500 border border-cyan-500/20'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                'Initiate Session'
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
