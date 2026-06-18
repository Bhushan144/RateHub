import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('dashboard');
    const [metrics, setMetrics] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [roleFilter, setRoleFilter] = useState('');
    const [order, setOrder] = useState('asc');

    const [showUserForm, setShowUserForm] = useState(false);
    const [showStoreForm, setShowStoreForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
    const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });

    useEffect(() => {
        fetchData();
    }, [activeTab, search, sortBy, roleFilter, order]);

    const fetchData = async () => {
        try {
            if (activeTab === 'dashboard') {
                const { data } = await api.get('/admin/dashboard');
                setMetrics(data.data);
            } else if (activeTab === 'users') {
                const { data } = await api.get(`/admin/users?search=${search}&sortBy=${sortBy}&order=${order}${roleFilter ? `&role=${roleFilter}` : ''}`);
                setUsers(data.data.users);
            } else if (activeTab === 'stores') {
                const { data } = await api.get(`/admin/stores?search=${search}&sortBy=${sortBy}&order=${order}`);
                setStores(data.data.stores);
            }
        } catch (error) {
            toast.error('Failed to fetch data');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', userForm);
            toast.success('User created successfully');
            setShowUserForm(false);
            setUserForm({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create user');
        }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/stores', storeForm);
            toast.success('Store created successfully');
            setShowStoreForm(false);
            setStoreForm({ name: '', email: '', address: '', ownerId: '' });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create store');
        }
    };

    const fetchUserDetails = async (id) => {
        try {
            const { data } = await api.get(`/admin/users/${id}`);
            
            const userData = data.data.user 
                ? { ...data.data.user, storeInfo: data.data.storeDetails } 
                : data.data;
                
            setSelectedUser(userData);
        } catch (error) {
            toast.error('Failed to fetch user details');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex border-b relative">
                    <button 
                        className={`flex-1 py-4 text-center font-semibold ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => { setActiveTab('dashboard'); setSearch(''); }}
                    >
                        Dashboard
                    </button>
                    <button 
                        className={`flex-1 py-4 text-center font-semibold ${activeTab === 'users' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => { setActiveTab('users'); setSearch(''); }}
                    >
                        Users
                    </button>
                    <button 
                        className={`flex-1 py-4 text-center font-semibold ${activeTab === 'stores' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => { setActiveTab('stores'); setSearch(''); }}
                    >
                        Stores
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="absolute right-4 top-4 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                        Logout
                    </button>
                </div>

                <div className="p-6">
                    {/* DASHBOARD TAB */}
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

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <>
                            <div className="flex justify-between mb-4">
                                <div className="flex gap-4 flex-wrap items-center">
                                    <input 
                                        type="text" 
                                        placeholder="Search by name, email, address..." 
                                        className="p-2 border rounded w-64"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <select 
                                        className="p-2 border rounded"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <option value="">All Roles</option>
                                        <option value="SYSTEM_ADMIN">System Admin</option>
                                        <option value="NORMAL_USER">Normal User</option>
                                        <option value="STORE_OWNER">Store Owner</option>
                                    </select>
                                    <select 
                                        className="p-2 border rounded"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="createdAt">Sort by Date</option>
                                        <option value="name">Sort by Name</option>
                                        <option value="email">Sort by Email</option>
                                    </select>
                                    <button
                                        onClick={() => setOrder(o => o === 'asc' ? 'desc' : 'asc')}
                                        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                                    >
                                        {order === 'asc' ? '↑ Asc' : '↓ Desc'}
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setShowUserForm(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    + Add User
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            {/* 1. Add the ID Header */}
                                            <th className="p-3 border-b">User ID</th> 
                                            <th className="p-3 border-b">Name</th>
                                            <th className="p-3 border-b">Email</th>
                                            <th className="p-3 border-b">Address</th>
                                            <th className="p-3 border-b">Role</th>
                                            <th className="p-3 border-b">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                {/* 2. Add the ID Data Cell (Using a smaller, monospaced font so it looks clean) */}
                                                <td className="p-3 border-b text-xs font-mono text-gray-500">{user.id}</td>
                                                
                                                <td className="p-3 border-b">{user.name}</td>
                                                <td className="p-3 border-b">{user.email}</td>
                                                <td className="p-3 border-b">{user.address}</td>
                                                <td className="p-3 border-b">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded ${user.role === 'SYSTEM_ADMIN' ? 'bg-red-200 text-red-800' : user.role === 'STORE_OWNER' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-3 border-b">
                                                    <button 
                                                        onClick={() => fetchUserDetails(user.id)}
                                                        className="text-blue-600 hover:underline text-sm font-semibold"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* STORES TAB */}
                    {activeTab === 'stores' && (
                        <>
                            <div className="flex justify-between mb-4">
                                <div className="flex gap-4 flex-wrap items-center">
                                    <input 
                                        type="text" 
                                        placeholder="Search by name, email, address..." 
                                        className="p-2 border rounded w-64"
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
                                        <option value="email">Sort by Email</option>
                                    </select>
                                    <button
                                        onClick={() => setOrder(o => o === 'asc' ? 'desc' : 'asc')}
                                        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                                    >
                                        {order === 'asc' ? '↑ Asc' : '↓ Desc'}
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setShowStoreForm(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    + Add Store
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-3 border-b">Name</th>
                                            <th className="p-3 border-b">Email</th>
                                            <th className="p-3 border-b">Address</th>
                                            <th className="p-3 border-b">Avg Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stores.map(store => (
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

            {/* CREATE USER MODAL */}
            {showUserForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <input required type="text" placeholder="Full Name (3-20 characters)" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                            <input required type="email" placeholder="Email Address" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                            <input required type="password" placeholder="Password" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
                            <input required type="text" placeholder="Address" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} />
                            <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                                <option value="NORMAL_USER">Normal User</option>
                                <option value="STORE_OWNER">Store Owner</option>
                                <option value="SYSTEM_ADMIN">System Admin</option>
                            </select>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowUserForm(false)} className="flex-1 bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CREATE STORE MODAL */}
            {showStoreForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Add New Store</h2>
                        <form onSubmit={handleCreateStore} className="space-y-4">
                            <input required type="text" placeholder="Store Name" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} />
                            <input required type="email" placeholder="Store Email" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={storeForm.email} onChange={e => setStoreForm({...storeForm, email: e.target.value})} />
                            <input required type="text" placeholder="Store Address" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} />
                            <input required type="text" placeholder="Owner ID (User must be STORE_OWNER)" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={storeForm.ownerId} onChange={e => setStoreForm({...storeForm, ownerId: e.target.value})} />
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowStoreForm(false)} className="flex-1 bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">Create Store</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* USER DETAILS MODAL */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold text-gray-800">User Details</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Name</p>
                                <p className="text-gray-800">{selectedUser.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                <p className="text-gray-800">{selectedUser.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Address</p>
                                <p className="text-gray-800">{selectedUser.address}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Role</p>
                                <span className={`inline-block mt-1 px-2 py-1 text-xs font-bold rounded ${selectedUser.role === 'SYSTEM_ADMIN' ? 'bg-red-200 text-red-800' : selectedUser.role === 'STORE_OWNER' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                    {selectedUser.role}
                                </span>
                            </div>
                            
                            {selectedUser.role === 'STORE_OWNER' && selectedUser.storeInfo && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                    <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                                        <span className="mr-2">🏪</span> Store Ownership Information
                                    </h3>
                                    <p className="text-sm text-gray-700"><strong className="text-gray-900">Name:</strong> {selectedUser.storeInfo.name || selectedUser.storeInfo.storeName}</p>
                                    <p className="text-sm text-gray-700 mt-1"><strong className="text-gray-900">Average Rating:</strong> <span className="text-blue-600 font-bold">{selectedUser.storeInfo.averageRating} ★</span></p>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => setSelectedUser(null)} 
                            className="mt-6 w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900 transition-colors font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}