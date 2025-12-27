import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function EditProductPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: null
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState(null); // To show existing image

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Categories
                const catRes = await api.get('/api/categories/');
                setCategories(catRes.data);

                // 2. Fetch Product Details
                const prodRes = await api.get(`/api/seller/dashboard/${slug}/`);
                const product = prodRes.data;

                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    category: product.category, // This should be the ID
                });
                setCurrentImage(product.image);

            } catch (err) {
                setError("Failed to load product data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category);

        // Only append image if a new one was selected
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await api.patch(`/api/seller/dashboard/${slug}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/seller/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update product.');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">Edit Product</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

                {/* Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Price & Stock */}
                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Price ($)</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                    <select
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="category"
                        value={formData.category} // Assuming category is an ID
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Image */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Product Image</label>
                    {currentImage && (
                        <img src={currentImage} alt="Current" className="w-20 h-20 object-cover mb-2 rounded" />
                    )}
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProductPage;
