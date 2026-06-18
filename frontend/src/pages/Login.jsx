import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', formData);
            login(data.data.user, data.token);
            toast.success('Logged in successfully!');
            
            // Redirect based on role
            if (data.data.user.role === 'SYSTEM_ADMIN') navigate('/admin');
            else if (data.data.user.role === 'STORE_OWNER') navigate('/owner');
            else navigate('/stores');

        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Log in to RateHub</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" placeholder="Email Address" required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">Log In</button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Need an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
                </p>

                {/* --- TEST CREDENTIALS BOX --- */}
                <div className="mt-8 bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 text-center uppercase tracking-wider">Test Credentials</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-semibold text-gray-800">System Admin</span>
                            <span className="select-all">admin@ratehub.com</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-semibold text-gray-800">Store Owner</span>
                            <span className="select-all">owner@store.com</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-semibold text-gray-800">Normal User</span>
                            <span className="select-all">user@normal.com</span>
                        </div>
                        <div className="text-center pt-1 text-gray-800">
                            <span className="font-semibold text-gray-600">Password for all:</span> <span className="select-all font-mono font-bold text-blue-600">Admin@123!</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}