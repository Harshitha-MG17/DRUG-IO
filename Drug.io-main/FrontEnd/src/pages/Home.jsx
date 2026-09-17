import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import predict from "../components/Predict";
import Footer from "../components/Footer";
import introAnimation from "../assets/Doctor.json";
import MainPredict from '../components/MainPredict';
import { Link } from 'react-router-dom';

function Home() {
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowIntro(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-all duration-500">
            <AnimatePresence>
                {showIntro ? (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 2 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center h-screen bg-white"
                    >
                        <Lottie
                            animationData={introAnimation}
                            loop={true}
                            className="w-96 h-96 md:w-[800px] md:h-[800px]"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="main"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="bg-white transition-all duration-1000"
                    >
                        <Header />
                        {/* Added Login Link for easy access */}
                        {/* Enhanced Login CTA */}
                        <div className="flex justify-end px-8 py-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(34, 211, 238, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                        boxShadow: ["0 0 0px rgba(34, 211, 238, 0)", "0 0 15px rgba(34, 211, 238, 0.3)", "0 0 0px rgba(34, 211, 238, 0)"]
                                    }}
                                    transition={{
                                        boxShadow: { duration: 3, repeat: Infinity }
                                    }}
                                    className="group relative px-8 py-3 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <span>Login / Dashboard</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                    </span>
                                    {/* Shine Effect Overlay */}
                                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                </motion.button>
                            </Link>
                        </div>
                        <MainContent />
                        <MainPredict />
                        <div className="h-8" />
                        <Footer />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home;
