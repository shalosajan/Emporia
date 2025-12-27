// src/pages/AddProductPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function AddProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories/');
        setCategories(response.data);
        if (response.data.length > 0) {
            setFormData(prev => ({ ...prev, category: response.data[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setError("Could not load categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Create FormData object for file upload
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.category) {
        data.append('category', formData.category);
    }
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await api.post('/api/seller/dashboard/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Redirect to dashboard on success
      navigate('/seller/dashboard');
    } catch (err) {
      console.error("Failed to create product", err);
      // Backend validation errors are often in err.response.data
      setError(err.response?.data?.detail || "Failed to create product. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:shadow-outline"
          >
             <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        {/* Price & Stock */}
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-bold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-bold mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Image */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Product Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full text-gray-700"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate('/seller/dashboard')}
            className="mr-4 text-gray-600 hover:text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductPage;
