import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'pharmacologist') {
                navigate('/pharmacologist/dashboard');
            } else {
                // Default to researcher dashboard for researchers and others
                navigate('/researcher/dashboard');
            }
        }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <p>Redirecting to your dashboard...</p>
        </div>
    );
};

export default Dashboard;
