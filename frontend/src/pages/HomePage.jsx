import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard'; // Import new component
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Variants for Staggered Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories/');
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);

        const response = await api.get(`/api/products/?${params.toString()}`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, category]);

  return (
    <div className="min-h-screen">

      {/* --- HERO SECTION --- */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Abstract Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="relative z-10 container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent px-4"
          >
            Discover the <br />
            <span className="text-indigo-glow drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">Extraordinary</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 px-4"
          >
            Explore a curated collection of premium artifacts from across the galaxy.
          </motion.p>

          {/* Search Bar - Hero Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl"
          >
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search for artifacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-transparent focus:ring-0 h-12 text-lg"
              />
            </div>
            <div className="md:w-64 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Filter size={18} />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer hover:bg-white/10 transition-colors"
              >
                <option value="" className="bg-obsidian">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-obsidian">{cat.name}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- PRODUCt GRID --- */}
      <section className="container mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 bg-red-500/10 rounded-xl border border-red-500/20">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No artifacts found in this sector.</p>
            <Button variant="ghost" className="mt-4" onClick={() => { setSearch(''); setCategory(''); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

export default HomePage;