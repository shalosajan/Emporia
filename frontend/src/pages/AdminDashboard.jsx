import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    // const api = useAxios(); // Removed
    const [stats, setStats] = useState({ total_users: 0, total_orders: 0, total_revenue: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/auth/admin/stats/');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Users</h3>
                            <span className="text-3xl font-bold text-gray-900">{stats.total_users}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Revenue</h3>
                            <span className="text-3xl font-bold text-gray-900">${stats.total_revenue}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Orders</h3>
                            <span className="text-3xl font-bold text-gray-900">{stats.total_orders}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Welcome to the Admin Control Panel</h3>
                <p className="text-gray-600">
                    Use the sidebar navigation to manage users, products, categories, and orders.
                </p>
                <div className="mt-4">
                    <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
                        Go to Backend Admin (Advanced)
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
