import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
            <p className="text-gray-400 mb-8">The page you are looking for does not exist.</p>
            <Link to="/dashboard" className="px-6 py-3 bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all font-bold">
                Back to Dashboard
            </Link>
        </div>
    );
};

export default NotFound;
