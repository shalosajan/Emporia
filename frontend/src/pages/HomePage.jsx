// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react'
import api from '../utils/api' // <-- Import our new API client
import { Link } from 'react-router-dom'

function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([]) // New state for categories

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter States
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    // Fetch Categories once on mount
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories/')
        setCategories(res.data)
      } catch (err) {
        console.error("Failed to fetch categories", err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch Products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        // Build query string
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (category) params.append('category', category)

        const response = await api.get(`/api/products/?${params.toString()}`)

        setProducts(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch products. Is the backend server running?')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search slightly to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, category]) // Re-run when these change

  if (loading && products.length === 0) {
    return <div className="text-center py-10">Loading products...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      {/* --- Search & Filter Controls --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded md:w-1/3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded md:w-1/3"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow bg-white"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-700 mt-2 truncate">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold text-green-600">${product.price}</p>
                <span className="text-xs text-gray-400">
                  {product.category_name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;