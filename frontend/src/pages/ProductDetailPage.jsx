import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAlert } from '../context/AlertContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${slug}/`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      if (product.stock === 0) {
        showAlert('This item is out of stock.', 'error');
        return;
      }
      addToCart(product, 1);
      showAlert(`${product.name} added to cart!`, 'success');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-400">
      {error}
    </div>
  );

  if (!product) return null;

  // Calculate stock percentage for bar (assume max 50 for visual)
  const stockPercent = Math.min((product.stock / 50) * 100, 100);
  const stockColor = product.stock < 5 ? 'bg-red-500' : product.stock < 20 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Artifacts
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* --- Image Section --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-[500px] overflow-hidden relative group p-0 border-0 bg-transparent">
              {/* Image with Zoom Effect */}
              {product.image ? (
                <div className="w-full h-full overflow-hidden rounded-2xl">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    whileHover={{ scale: 1.25 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
                  No Visual Data
                </div>
              )}
            </Card>
          </motion.div>

          {/* --- Details Section --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2">
              <Badge variant="indigo" className="text-sm px-3 py-1">
                {product.category_name}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <span className="text-3xl font-bold text-indigo-400">
                ${product.price}
              </span>

              {/* Vendor Info */}
              <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <ShieldCheck size={14} className="text-green-400" />
                <span>Sold by <strong className="text-gray-200">{product.seller_name}</strong></span>
              </div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed mb-8 border-l-2 border-indigo-500 pl-6">
              {product.description}
            </p>

            {/* Stock Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-gray-400">Availability</span>
                <span className={`text-sm font-bold ${product.stock < 5 ? 'text-red-400' : 'text-green-400'}`}>
                  {product.stock} Units Left
                </span>
              </div>
              <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${stockColor} shadow-[0_0_10px_currentColor]`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stockPercent}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag size={20} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button variant="secondary" size="lg" title="Express Delivery Available">
                <Truck size={20} />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;