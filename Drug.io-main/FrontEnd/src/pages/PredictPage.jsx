import React from 'react';
import Header from '../components/Header';
import MainPredict from '../components/MainPredict';
import Footer from '../components/Footer';

function PredictPage() {
    return (
        <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-all duration-500">
            <Header />
            <div className="pt-24 pb-12">
                <MainPredict />
            </div>
            <Footer />
        </div>
    );
}

export default PredictPage;
