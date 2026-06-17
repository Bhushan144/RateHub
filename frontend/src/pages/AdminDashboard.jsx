import { useState, useEffect } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [metrics, setMetrics] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');

    useEffect(() => {
        fetchData();
    }, [activeTab, search, sortBy]);

    const fetchData = async () => {
        try {
            if (activeTab === 'dashboard') {
                const { data } = await api.get('/admin/dashboard');
                setMetrics(data.data);
            } else if (activeTab === 'users') {
                const { data } = await api.get(`/admin/users?search=${search}&sortBy=${sortBy}`);
                setUsers(data.data.users);
            } else if (activeTab === 'stores') {
                const { data } = await api.get(`/admin/stores?search=${search}&sortBy=${sortBy}`);
                setStores(data.data.stores);
            }
        } catch (error) {
            toast.error('Failed to fetch data');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex border-b">
                    <button 
                        className={`flex-1 py-4 text-center font-semibold ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => { setActiveTab('dashboard'); setSearch(''); }}
                    >
                        Dashboard Metrics
                    </button>
                    <button 
                        className={`flex-1 py-4 text-center font-semibold ${activeTab === 'users' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => { setActiveTab('users'); setSearch(''); }}
                    >
                        Manage Users
                    </button>
                    <button 
                        className={`flex-1 py-4 text-center font-semibold ${activeTab === 'stores' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => { setActiveTab('stores'); setSearch(''); }}
                    >
                        Manage Stores
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-3 gap-6">
                            <div className="p-6 bg-blue-100 rounded-lg shadow text-center">
                                <h3 className="text-xl font-bold text-blue-800">Total Users</h3>
                                <p className="text-4xl font-extrabold text-blue-600 mt-2">{metrics.totalUsers}</p>
                            </div>
                            <div className="p-6 bg-green-100 rounded-lg shadow text-center">
                                <h3 className="text-xl font-bold text-green-800">Total Stores</h3>
                                <p className="text-4xl font-extrabold text-green-600 mt-2">{metrics.totalStores}</p>
                            </div>
                            <div className="p-6 bg-purple-100 rounded-lg shadow text-center">
                                <h3 className="text-xl font-bold text-purple-800">Total Ratings</h3>
                                <p className="text-4xl font-extrabold text-purple-600 mt-2">{metrics.totalRatings}</p>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'users' || activeTab === 'stores') && (
                        <>
                            <div className="flex justify-between mb-4">
                                <input 
                                    type="text" 
                                    placeholder="Search by name, email, or address..." 
                                    className="p-2 border rounded w-1/3"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <select 
                                    className="p-2 border rounded"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="createdAt">Sort by Date</option>
                                    <option value="name">Sort by Name</option>
                                </select>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-3 border-b">Name</th>
                                            <th className="p-3 border-b">Email</th>
                                            <th className="p-3 border-b">Address</th>
                                            {activeTab === 'users' ? <th className="p-3 border-b">Role</th> : <th className="p-3 border-b">Avg Rating</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTab === 'users' ? users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="p-3 border-b">{user.name}</td>
                                                <td className="p-3 border-b">{user.email}</td>
                                                <td className="p-3 border-b">{user.address}</td>
                                                <td className="p-3 border-b">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded ${user.role === 'SYSTEM_ADMIN' ? 'bg-red-200 text-red-800' : user.role === 'STORE_OWNER' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : stores.map(store => (
                                            <tr key={store.id} className="hover:bg-gray-50">
                                                <td className="p-3 border-b">{store.name}</td>
                                                <td className="p-3 border-b">{store.email}</td>
                                                <td className="p-3 border-b">{store.address}</td>
                                                <td className="p-3 border-b font-bold text-blue-600">{store.rating} / 5</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}