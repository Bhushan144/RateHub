import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import StoreListings from './pages/StoreListings';
import OwnerDashboard from './pages/OwnerDashboard'; 

function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/stores" element={<ProtectedRoute allowedRoles={['NORMAL_USER']}><StoreListings /></ProtectedRoute>} />
                    <Route path="/owner" element={<ProtectedRoute allowedRoles={['STORE_OWNER']}><OwnerDashboard /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}