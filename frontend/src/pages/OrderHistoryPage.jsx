import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

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
                setError('Failed to load orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading orders...</div>;

    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center text-gray-600 bg-white p-8 rounded shadow">
                    <p className="text-lg">You haven't placed any orders yet.</p>
                    <Link to="/" className="text-blue-600 hover:underline mt-4 block">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white shadow rounded-lg p-6 border">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <div>
                                    <p className="font-bold text-gray-800">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${order.paid ? 'text-green-600' : 'text-orange-500'}`}>
                                        {order.paid ? 'Paid' : 'Pending Payment'}
                                    </p>
                                    <p className="font-bold text-xl">${order.total_cost || '0.00'}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-2">
                                {order.items && order.items.map((item) => (
                                    // Note: Backend serializer for Order might not explicitly include items details 
                                    // unless we updated OrderSerializer to include nested items.
                                    // Accessing nested product object from serializer
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.product?.name || 'Unknown Product'} (x{item.quantity})</span>
                                        <span>${item.price}</span>
                                    </div>
                                ))
                                }
                                {(!order.items || order.items.length === 0) && (
                                    <p className="text-sm text-gray-500 italic">Item details not available.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;
