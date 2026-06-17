import { useState, useEffect } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
    if (!dashboardData) return <div className="p-8 text-center text-red-500">No store found for this account.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Store Owner Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Ratings</h2>
                    </div>
                    {dashboardData.ratingsDetails.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No ratings yet.</div>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    );
}