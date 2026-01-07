import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-gray-500" size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8 max-w-md">Looks like you haven't added any artifacts to your collection yet.</p>
        <Link to="/">
          <Button variant="primary" size="lg">Explore Artifacts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
        <ShoppingBag className="text-indigo-500" />
        Your Collection <span className="text-lg text-gray-500 font-normal">({getCartCount()} items)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* --- Cart Items --- */}
        <div className="flex-grow lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="p-4 flex items-center gap-4 group">
              {/* Image */}
              <div className="w-24 h-24 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-100">{item.name}</h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-indigo-400 font-medium">${item.price}</p>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                    <button
                      className="px-3 py-1 hover:bg-white/10 text-gray-400 transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                    <button
                      className="px-3 py-1 hover:bg-white/10 text-gray-400 transition-colors"
                      onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* --- Order Summary --- */}
        <div className="lg:w-1/3">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-white">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Taxes (Estimated)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400 font-medium">Free</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-gray-300 font-medium">Total</span>
                <span className="text-3xl font-bold text-indigo-400">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button variant="primary" size="lg" className="w-full justify-between group">
                Proceed to Checkout
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-xs text-center text-gray-500 mt-4">
              Secure checkout powered by Razorpay.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}

export default CartPage;