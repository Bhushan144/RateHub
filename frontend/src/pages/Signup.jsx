import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axios';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });

    const validateForm = () => {
        if (formData.name.length < 3 || formData.name.length > 20) return "Name must be between 3 and 20 characters.";
        if (formData.address.length > 400) return "Address cannot exceed 400 characters.";
        if (formData.password.length < 8 || formData.password.length > 16) return "Password must be 8-16 characters.";
        if (!/[A-Z]/.test(formData.password)) return "Password must contain an uppercase letter.";
        if (!/[^a-zA-Z0-9]/.test(formData.password)) return "Password must contain a special character.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateForm();
        if (error) return toast.error(error);

        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Create RateHub Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" placeholder="Full Name (3-20 characters)" required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                        type="email" placeholder="Email Address" required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password (8-16 chars, 1 uppercase, 1 special)" required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <textarea 
                        placeholder="Full Address (Max 400 characters)" required rows="3"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Sign Up</button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}