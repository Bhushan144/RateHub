import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/axios';

export default function StoreListings() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const fetchStores = async () => {
        try {
            const { data } = await api.get(`/users/stores?search=${search}&sortBy=${sortBy}`);
            setStores(data.data.stores);
        } catch (error) {
            toast.error('Failed to fetch stores');
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchStores();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, sortBy]);

    const handleRating = async (storeId, score) => {
        try {
            await api.post('/users/ratings', { storeId, score });
            toast.success('Rating saved successfully!');
            fetchStores(); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit rating');
        }
    };

    
    const StarRating = ({ storeId, currentRating }) => {
        return (
            <div className="flex space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRating(storeId, star)}
                        className={`text-2xl transition-colors ${
                            currentRating && star <= currentRating 
                                ? 'text-yellow-400 hover:text-yellow-500' 
                                : 'text-gray-300 hover:text-yellow-400'
                        }`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800">Discover Stores</h1>
                    
                    <div className="flex space-x-4 w-1/2">
                        <input 
                            type="text" 
                            placeholder="Search by name or address..." 
                            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select 
                            className="p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="address">Sort by Address</option>
                        </select>
                    </div>
                </div>

                {stores.length === 0 ? (
                    <div className="text-center text-gray-500 mt-12 text-lg">No stores found matching your criteria.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map(store => (
                            <div key={store.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{store.name}</h2>
                                        <p className="text-sm text-gray-500 mt-1">{store.address}</p>
                                    </div>
                                    <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-center">
                                        <span className="block text-xs text-blue-600 font-semibold">Overall</span>
                                        <span className="block text-lg font-bold text-blue-800">{store.overallRating} ★</span>
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <p className="text-sm text-gray-600 font-medium">Your Rating:</p>
                                    <StarRating storeId={store.id} currentRating={store.myRating} />
                                    {store.myRating ? (
                                        <p className="text-xs text-green-600 mt-1">You rated this {store.myRating} stars.</p>
                                    ) : (
                                        <p className="text-xs text-gray-400 mt-1">Click a star to submit a rating.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}