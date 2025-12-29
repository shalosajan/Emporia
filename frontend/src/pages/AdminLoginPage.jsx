import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminLoginPage = () => {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // If already logged in as SuperUser, redirect to dashboard
    useEffect(() => {
        if (user && user.staff_level === 'SUPER_ADMIN') {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Pass 'true' for isAdmin
            await login(email, password, true);
            navigate('/admin/dashboard');
        } catch (err) {
            // Error handling
            console.error("Admin Login Failed:", err);
            setError(err.message || 'Invalid credentials or unauthorized access.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-red-500">SECURE PORTAL</h1>
                    <p className="mt-2 text-sm text-gray-400">Authorized Personnel Only</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Admin ID / Email
                        </label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-red-500 focus:ring-red-500 sm:text-sm p-2"
                            placeholder="admin@emporia.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Secure Password
                        </label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-red-500 focus:ring-red-500 sm:text-sm p-2"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${isLoading ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700'} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-colors`}
                    >
                        {isLoading ? 'Authenticating...' : 'Access Portal'}
                    </button>

                    <div className="text-center mt-4 text-xs text-gray-500">
                        <p>Unauthorized access attempts are monitored and logged.</p>
                        <p className="mt-2">Users must use Public Gate.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
