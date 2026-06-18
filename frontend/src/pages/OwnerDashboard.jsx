import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function OwnerDashboard() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/owner/dashboard');
                setDashboardData(data.data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/owner/logout');
        } catch (e) {
        } finally {
            logout();
            navigate('/login');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/owner/password', { password: newPassword });
            toast.success('Password updated successfully!');
            setNewPassword(''); // Clear the input
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password. Ensure it meets security requirements.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
    if (!dashboardData) return <div className="p-8 text-center text-red-500">No store found for this account.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Store Owner Dashboard</h1>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Your Store</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{dashboardData.storeName}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Average Rating</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardData.averageRating} <span className="text-xl text-blue-400">★</span></p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Ratings</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{dashboardData.totalRatings}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                    {/* Ratings Table - Takes up 2/3 of the space on large screens */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Ratings</h2>
                        </div>
                        {dashboardData.ratingsDetails.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No ratings yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b">
                                            <th className="p-4 text-sm font-semibold text-gray-600">User Name</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Score</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.ratingsDetails.map((rating, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-4 text-gray-800 font-medium">{rating.name}</td>
                                                <td className="p-4 text-gray-600">{rating.email}</td>
                                                <td className="p-4 text-blue-600 font-bold">{rating.score} ★</td>
                                                <td className="p-4 text-gray-500 text-sm">{new Date(rating.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Settings Panel - Takes up 1/3 of the space */}
                    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 h-fit">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        placeholder="New Password" 
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Must be 8-16 characters, 1 uppercase, 1 special character.</p>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">
                                    Change Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}