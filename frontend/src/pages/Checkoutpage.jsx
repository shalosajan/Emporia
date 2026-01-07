import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAlert } from '../context/AlertContext'; // Updated to use context
import api from '../utils/api';
import { CreditCard, Truck, CheckCircle, ShieldAlert } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function CheckoutPage() {
  const { user, isImpersonating } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: user?.email || '',
    address: '',
    city: '',
    postal_code: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const orderData = { ...formData, items: orderItems };
      const orderResponse = await api.post('/api/orders/create/', orderData);
      const ourOrderId = orderResponse.data.id;

      const paymentResponse = await api.post('/api/orders/pay/', { order_id: ourOrderId });
      const { razorpay_order_id, amount, key } = paymentResponse.data;

      const options = {
        key: key,
        amount: amount,
        currency: "INR",
        name: "Emporia",
        description: "Premium Artifact Acquisition",
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            await api.post('/api/orders/verify-payment/', verificationData);
            clearCart();
            navigate('/order-success');
          } catch (verifyError) {
            showAlert('Payment verification failed.', 'error');
            setLoading(false);
          }
        },
        prefill: {
          name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
        },
        theme: { color: "#6366F1" }, // Electric Indigo
        modal: {
          ondismiss: function () {
            showAlert('Payment cancelled.', 'warning');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      showAlert('Failed to initiate secure channel.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
          <CreditCard size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Secure Checkout</h1>
          <p className="text-gray-400 text-sm">Encrypted Transaction Channel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Shipping Form --- */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Truck className="text-indigo-400" /> Shipping Details
            </h2>

            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="first_name" label="First Name" placeholder="John" onChange={handleChange} required />
                <Input name="last_name" label="Last Name" placeholder="Doe" onChange={handleChange} required />
              </div>
              <Input type="email" name="email" label="Email Address" value={formData.email} onChange={handleChange} required />
              <Input name="address" label="Shipping Address" placeholder="123 Galaxy Lane" onChange={handleChange} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="city" label="City" placeholder="Neo Tokyo" onChange={handleChange} required />
                <Input name="postal_code" label="Postal Code" placeholder="10001" onChange={handleChange} required />
              </div>

              {isImpersonating && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                  <ShieldAlert className="text-yellow-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-yellow-500 font-bold text-sm">View Mode Enabled</h4>
                    <p className="text-yellow-500/80 text-xs mt-1">
                      Financial transactions are disabled while impersonating a user.
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-6"
                isLoading={loading}
                disabled={loading || isImpersonating}
              >
                {loading ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
              </Button>
            </form>
          </Card>
        </div>

        {/* --- Order Summary --- */}
        <div>
          <Card className="p-6 sticky top-24 bg-white/5 border-white/5">
            <h3 className="font-bold text-white mb-4">Order Summary</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <span className="text-gray-300 truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-400 text-sm font-medium">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-white">Total</span>
              <span className="font-bold text-2xl text-indigo-400">${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="mt-6 flex items-center gap-2 justify-center text-xs text-green-400 bg-green-500/10 py-2 rounded">
              <CheckCircle size={14} />
              <span>Verified Secure Payment</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;