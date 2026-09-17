import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkHistory from './pages/WorkHistory';
import Safety from './pages/Safety';
import PredictPage from './pages/PredictPage';
import AdminDashboard from './pages/AdminDashboard';
import ResearcherDashboard from './pages/ResearcherDashboard';
import PharmacologistDashboard from './pages/PharmacologistDashboard';
import SaferCombinations from './pages/SaferCombinations';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/researcher/dashboard"
            element={
              <ProtectedRoute>
                <ResearcherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacologist/dashboard"
            element={
              <ProtectedRoute>
                <PharmacologistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safer-combinations"
            element={
              <SaferCombinations />
            }
          />
          {/* Restored Routes */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <WorkHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safety-logs"
            element={
              <ProtectedRoute>
                <WorkHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safety"
            element={
              <Safety />
            }
          />
          <Route
            path="/predict"
            element={
              <PredictPage />
            }
          />
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
