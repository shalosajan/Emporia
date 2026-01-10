import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAlert } from '../../context/AlertContext';
import { Package, XCircle, Trash2, Search, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const AdminProducts = () => {
    const { showAlert } = useAlert();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/admin/products/');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await api.delete(`/api/admin/products/${productToDelete.slug}/`);
            setProducts(products.filter(p => p.id !== productToDelete.id));
            setModalOpen(false);
            setProductToDelete(null);
            showAlert("Artifact successfully deleted.", 'success');
        } catch (error) {
            console.error("Error deleting product:", error);
            showAlert("Failed to delete artifact.", 'error');
        }
    };

    const cancelDelete = () => {
        setModalOpen(false);
        setProductToDelete(null);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        String(p.id).includes(search)
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-3xl font-bold text-white">Inventory Control</h2>
                <div className="w-full md:w-64">
                    <Input
                        icon={Search}
                        placeholder="Search Inventory..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:block bg-glass-surface backdrop-blur-xl border border-glass-border rounded-xl overflow-hidden shadow-2xl">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Artifact</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Credits</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-indigo-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-transparent">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded bg-white/5 overflow-hidden">
                                            {product.image ? (
                                                <img className="h-10 w-10 object-cover" src={product.image} alt="" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-500"><Package size={16} /></div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-white max-w-[200px] truncate" title={product.name}>{product.name}</div>
                                            <div className="text-xs text-gray-500">ID: {product.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    <Badge variant="ghost">{product.category}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-400">
                                    ${product.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Badge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}>
                                        {product.stock} Units
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDeleteClick(product)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MOBILE VIEW (CARDS) --- */}
            <div className="md:hidden space-y-4">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="p-0 overflow-hidden flex flex-row">
                        {/* Image Left */}
                        <div className="w-1/3 min-h-[120px] bg-white/5 relative">
                            {product.image ? (
                                <img className="w-full h-full object-cover absolute inset-0" src={product.image} alt="" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500"><Package size={24} /></div>
                            )}
                        </div>

                        {/* Content Right */}
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight">{product.name}</h3>
                                    <button
                                        onClick={() => handleDeleteClick(product)}
                                        className="text-gray-500 hover:text-red-400 p-1 -mt-1 -mr-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="text-xs text-gray-400 mb-2">{product.category}</div>
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Price</span>
                                    <span className="text-indigo-400 font-bold text-base">${product.price}</span>
                                </div>
                                <Badge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'} className="text-[10px]">
                                    {product.stock} left
                                </Badge>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                title="Delete Artifact"
                message={`Are you sure you want to scrub "${productToDelete?.name}" from the database? This cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default AdminProducts;
