import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Package, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/orders/my-orders/');
                setOrders(response.data);
            } catch (err) {
                setError('Failed to retrieve shipping logs.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-[50vh] text-red-400">
            {error}
        </div>
    );

    return (
        <div className="container mx-auto max-w-5xl px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Package className="text-indigo-400" /> Shipping History
            </h1>
            <p className="text-gray-400 mb-8">Track your acquisitions across the galaxy.</p>

            {orders.length === 0 ? (
                <Card className="p-12 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500">
                        <Package size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Acquisitions Found</h3>
                    <p className="text-gray-400 mb-6">You haven't secured any artifacts yet.</p>
                    <Link to="/">
                        <Button variant="primary">Explore Artifacts</Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id} className="p-6 transition-all hover:bg-white/5">
                            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-white/10 pb-4 mb-4 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        Order #{order.id}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                        <Clock size={14} />
                                        Placed on: {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={order.paid ? 'success' : 'warning'} className="flex items-center gap-1">
                                        {order.paid ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                        {order.paid ? 'Paid' : 'Pending'}
                                    </Badge>
                                    <span className="text-2xl font-bold text-indigo-400">${order.total_cost || '0.00'}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-black/20 rounded-lg p-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Manifest</h4>
                                <div className="space-y-3">
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-600 text-xs">
                                                    x{item.quantity}
                                                </div>
                                                <span className="text-gray-300 font-medium">
                                                    {item.product?.name || `Artifact #${item.product_id || 'Unknown'}`}
                                                </span>
                                            </div>
                                            <span className="text-gray-400 font-mono">${item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;
