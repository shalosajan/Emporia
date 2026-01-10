import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, Activity, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Mock Data for Admin Chart
const data = [
    { name: 'Jan', revenue: 12000 },
    { name: 'Feb', revenue: 19000 },
    { name: 'Mar', revenue: 15000 },
    { name: 'Apr', revenue: 24000 },
    { name: 'May', revenue: 28000 },
    { name: 'Jun', revenue: 32000 },
    { name: 'Jul', revenue: 45000 },
];

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_users: 0, total_orders: 0, total_revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/auth/admin-dashboard-stats/');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center"><div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full mx-auto"></div></div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-6">System Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={100} />
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/20 text-blue-400 z-10">
                        <Users size={32} />
                    </div>
                    <div className="z-10">
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Users</h3>
                        <p className="text-3xl font-bold text-white">{stats.total_users}</p>
                    </div>
                </Card>

                <Card className="p-6 flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={100} />
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/20 text-green-400 z-10">
                        <DollarSign size={32} />
                    </div>
                    <div className="z-10">
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Revenue</h3>
                        <p className="text-3xl font-bold text-white">${stats.total_revenue}</p>
                    </div>
                </Card>

                <Card className="p-6 flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag size={100} />
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/20 text-purple-400 z-10">
                        <ShoppingBag size={32} />
                    </div>
                    <div className="z-10">
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Orders</h3>
                        <p className="text-3xl font-bold text-white">{stats.total_orders}</p>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart */}
                <Card className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="text-indigo-400" />
                            Platform Growth
                        </h3>
                    </div>
                    {/* Explicit container height for Recharts */}
                    <div className="w-full h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#ffffff50" />
                                <YAxis stroke="#ffffff50" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#ffffff20', color: '#fff' }}
                                    itemStyle={{ color: '#10B981' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Quick Actions / System Status */}
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link to="/admin/users">
                            <Button variant="secondary" className="w-full justify-between mb-3">
                                Manage Users
                                <ArrowRight size={18} />
                            </Button>
                        </Link>
                        <Link to="/admin/products">
                            <Button variant="secondary" className="w-full justify-between mb-3">
                                Manage Products
                                <ArrowRight size={18} />
                            </Button>
                        </Link>
                        <Link to="/admin/audit-logs">
                            <Button variant="secondary" className="w-full justify-between mb-3">
                                View Audit Logs
                                <ArrowRight size={18} />
                            </Button>
                        </Link>
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-xs text-center text-gray-500">System Status: <span className="text-green-400 font-bold">OPERATIONAL</span></p>
                            <p className="text-xs text-center text-gray-500 mt-1">Version 2.0.0 (Deep Space)</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
