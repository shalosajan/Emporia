import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, MessageSquare, Star } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StarRating from '../components/reviews/StarRating';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';

function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal State
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { showAlert } = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Product
        const productRes = await api.get(`/api/products/${slug}/`);
        setProduct(productRes.data);

        // Fetch Reviews (assuming product ID is available from slug response or we fetch by ID after)
        // Note: We need the ID for the reviews endpoint. 
        if (productRes.data.id) {
          const reviewsRes = await api.get(`/api/reviews/product/${productRes.data.id}/`);
          setReviews(reviewsRes.data);
        }

        setError(null);
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleSubmitReview = async (formData) => {
    if (!user) {
      showAlert("You must be logged in to leave a review.", "error");
      return;
    }
    setIsSubmittingReview(true);
    try {
      await api.post(`/api/reviews/product/${product.id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showAlert("Review submitted successfully!", "success");
      setReviewModalOpen(false);

      // Refresh reviews
      const reviewsRes = await api.get(`/api/reviews/product/${product.id}/`);
      setReviews(reviewsRes.data);

      // Refresh product to update avg rating (optional, might need reload or wait for signal)
      // For now, let's just assume the user sees their review added.
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || "Failed to submit review.";
      showAlert(errorMsg, "error");
    } finally {
      setIsSubmittingReview(false);
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

  const stockPercent = Math.min((product.stock / 50) * 100, 100);
  const stockColor = product.stock < 5 ? 'bg-red-500' : product.stock < 20 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Artifacts
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* --- Image Section --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-[300px] md:h-[500px] overflow-hidden relative group p-0 border-0 bg-transparent">
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
              <Badge variant="indigo" className="text-xs md:text-sm px-3 py-1">
                {product.category_name}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating Header */}
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.average_rating || 0} size={20} />
              <span className="text-gray-400 text-sm">
                {product.average_rating > 0 ? product.average_rating : "No ratings"}
                {' '}
                ({product.review_count} reviews)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 md:mb-8">
              <span className="text-2xl md:text-3xl font-bold text-indigo-400">
                ${product.price}
              </span>

              <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <ShieldCheck size={14} className="text-green-400" />
                <span>Sold by <strong className="text-gray-200">{product.seller_name}</strong></span>
              </div>
            </div>

            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6 md:mb-8 border-l-2 border-indigo-500 pl-4 md:pl-6">
              {product.description}
            </p>

            {/* Stock Indicator */}
            <div className="mb-6 md:mb-8">
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
                className="flex-1 gap-2 text-sm md:text-base"
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

        {/* --- Reviews Section --- */}
        <div className="border-t border-white/10 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="text-indigo-400" />
              Customer Reviews
            </h2>
            <Button
              variant="secondary"
              onClick={() => {
                if (user) setReviewModalOpen(true);
                else showAlert("Please log in to review this product.", "info");
              }}
            >
              Write a Review
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Summary Card */}
            <div className="md:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center sticky top-24">
                <div className="text-5xl font-bold text-white mb-2">{product.average_rating || "0.0"}</div>
                <div className="flex justify-center mb-2">
                  <StarRating rating={product.average_rating || 0} size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-6">Based on {product.review_count || 0} reviews</p>

                <div className="text-left text-xs text-gray-500 space-y-1">
                  <p>5 Stars</p>
                  <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className="bg-yellow-400 h-full" style={{ width: '0%' }}></div>
                    {/* Note: Backend needs to send distribution or we calculate it from `reviews` array */}
                  </div>
                  {/* Add distribution bars later if needed */}
                </div>
              </div>
            </div>

            {/* Review List */}
            <div className="md:col-span-2">
              <ReviewList reviews={reviews} />
            </div>
          </div>
        </div>

        {/* Review Modal */}
        <ReviewForm
          isOpen={isReviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmittingReview}
        />

      </div>
    </div>
  );
}

export default ProductDetailPage;
