// src/pages/SellerDashboard.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal'; // Import Modal

function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        setLoading(true);
        // This endpoint returns only the logged-in seller's products
        const response = await api.get('/api/seller/dashboard/');
        setProducts(response.data);
      } catch (err) {
        // If the user is not a seller, the backend sends a 403 Forbidden
        if (err.response && err.response.status === 403) {
          setError("You are not an approved seller.");
        } else {
          setError("Failed to load dashboard.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, []);

  const handleDeleteClick = (slug) => {
    setProductToDelete(slug);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await api.delete(`/api/seller/dashboard/${productToDelete}/`);
      setProducts(products.filter(p => p.slug !== productToDelete));
      setIsModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;

  if (error) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
        <p className="mt-4">Please contact the admin or register as a seller.</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 block">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        {/* We will build this 'Add Product' page next */}
        <Link
          to="/seller/add-product"
          className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b bg-gray-50">
          My Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You haven't posted any products yet.
          </div>
        ) : (
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 font-bold text-gray-600">Image</th>
                <th className="px-6 py-3 font-bold text-gray-600">Name</th>
                <th className="px-6 py-3 font-bold text-gray-600">Price</th>
                <th className="px-6 py-3 font-bold text-gray-600">Stock</th>
                <th className="px-6 py-3 font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold">{product.name}</td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/seller/edit-product/${product.slug}`}
                      className="text-blue-500 hover:text-blue-700 mr-4 font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product.slug)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}

export default SellerDashboard;
