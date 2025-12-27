// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

// Helper function to load an external script
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, getCartTotal,clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: user.email || '', // Pre-fill with user's email
    address: '',
    city: '',
    postal_code: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load the Razorpay script when the component mounts
  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Main Payment Handling Function ---
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // --- Step 1: Create the Order in our Django DB ---
    try {
      // Format cart items for the backend serializer
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        ...formData,
        items: orderItems,
      };

      const orderResponse = await api.post('/api/orders/create/', orderData);
      const ourOrderId = orderResponse.data.id;

      // --- Step 2: Get Razorpay Order ID from our backend ---
      const paymentResponse = await api.post('/api/orders/pay/', { 
        order_id: ourOrderId 
      });
      
      const { razorpay_order_id, amount, key } = paymentResponse.data;

      // --- Step 3: Open the Razorpay Payment Popup ---
      const options = {
        key: key,
        amount: amount,
        currency: "INR",
        name: "Emporia",
        description: "E-commerce Transaction",
        order_id: razorpay_order_id,
        
        // This 'handler' function is called when payment is successful
        handler: async function (response) {
          try {
            // --- Step 4: Verify the Payment with our backend ---
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            await api.post('/api/orders/verify-payment/', verificationData);

            // Payment is successful!
            clearCart(); // Clear the cart from state and localStorage

            navigate('/order-success'); // Redirect to a success page

          } catch (verifyError) {
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
        },
        theme: {
          color: "#3399cc",
        },
        // This is called if the user closes the popup
        modal: {
          ondismiss: function() {
            setError('Payment was cancelled.');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError('Failed to create order. Please check your details.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-12">
        {/* --- Shipping Form (Left) --- */}
        <div className="md:w-2/3">
          <form onSubmit={handlePayment} className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required className="p-3 border rounded"/>
              <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required className="p-3 border rounded"/>
            </div>
            <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} required className="w-full p-3 border rounded mb-4"/>
            <input type="text" name="address" placeholder="Address" onChange={handleChange} required className="w-full p-3 border rounded mb-4"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input type="text" name="city" placeholder="City" onChange={handleChange} required className="p-3 border rounded"/>
              <input type="text" name="postal_code" placeholder="Postal Code" onChange={handleChange} required className="p-3 border rounded"/>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-center bg-green-600 text-white font-bold py-4 px-6 rounded hover:bg-green-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* --- Order Summary (Right) --- */}
        <div className="md:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-3 border-b pb-3">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded"/>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;