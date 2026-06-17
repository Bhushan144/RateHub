import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<AdminDashboard />} /> 
                    <Route path="/stores" element={<div className="p-8 text-2xl">Store Listings (Task 8)</div>} />
                    <Route path="/owner" element={<div className="p-8 text-2xl">Owner Dashboard (Task 9)</div>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}