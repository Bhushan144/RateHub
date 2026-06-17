import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import StoreListings from './pages/StoreListings';
import OwnerDashboard from './pages/OwnerDashboard'; 

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
                    <Route path="/stores" element={<StoreListings />} />
                    <Route path="/owner" element={<OwnerDashboard />} /> 
                </Routes>
            </Router>
        </AuthProvider>
    );
}