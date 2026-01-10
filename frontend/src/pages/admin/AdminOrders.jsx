import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Package, Clock, CheckCircle, Search, DollarSign, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/orders/admin-orders/');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setLoading(false);
        }
    };

    const toggleOrder = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(search) ||
        order.customer_email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-3xl font-bold text-white">Global Order History</h2>
                <div className="w-full md:w-64">
                    <Input
                        icon={Search}
                        placeholder="Search Orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:block bg-glass-surface backdrop-blur-xl border border-glass-border rounded-xl overflow-hidden shadow-2xl">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-transparent">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-400">${order.total_cost}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={order.paid ? 'success' : 'warning'} className="flex items-center gap-1 w-fit">
                                        {order.paid ? <CheckCircle size={12} /> : <Clock size={12} />}
                                        {order.paid ? 'Paid' : 'Pending'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MOBILE VIEW (CARDS) --- */}
            <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => (
                    <Card key={order.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-xs text-indigo-400 font-bold">#{order.id}</span>
                                <div className="text-sm font-bold text-white">{order.customer_email}</div>
                            </div>
                            <Badge variant={order.paid ? 'success' : 'warning'} className="text-xs">
                                {order.paid ? 'Paid' : 'Pending'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4 border-t border-white/10 pt-4">
                            <div>
                                <span className="text-xs text-gray-500 flex items-center gap-1"><DollarSign size={12} /> Total</span>
                                <div className="text-base font-bold text-indigo-400">${order.total_cost}</div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-500 flex items-center gap-1 justify-end"><Calendar size={12} /> Date</span>
                                <div className="text-sm text-gray-300">{new Date(order.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>

                        {/* Expandable Details (Placeholder for future items) */}
                        <div className="mt-4 pt-2 border-t border-white/10">
                            <button
                                onClick={() => toggleOrder(order.id)}
                                className="w-full flex justify-between items-center text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                <span>Order Details</span>
                                {expandedOrderId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <AnimatePresence>
                                {expandedOrderId === order.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 text-xs text-gray-500">
                                            No items data available in this preview.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;
