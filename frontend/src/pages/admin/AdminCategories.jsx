import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminCategories = () => {
    // const api = useAxios(); // Removed
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/admin/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/admin/categories/', { name: newCategoryName, slug: newCategoryName.toLowerCase().replace(/ /g, '-') });
            setCategories([...categories, response.data]);
            setNewCategoryName('');
        } catch (error) {
            console.error("Error creating category:", error);
            alert("Failed to create category");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingCategory) return;
        try {
            const response = await api.patch(`/api/admin/categories/${editingCategory.id}/`, {
                name: editingCategory.name,
                slug: editingCategory.name.toLowerCase().replace(/ /g, '-')
            });
            setCategories(categories.map(c => c.id === editingCategory.id ? response.data : c));
            setEditingCategory(null);
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Failed to update category");
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await api.delete(`/api/admin/categories/${categoryToDelete.id}/`);
            setCategories(categories.filter(c => c.id !== categoryToDelete.id));
            setModalOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category");
        }
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Category Management</h2>

            {/* Create Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category Name"
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Add</button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {editingCategory?.id === category.id ? (
                                        <input
                                            type="text"
                                            value={editingCategory.name}
                                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                            className="border p-1 rounded"
                                        />
                                    ) : (
                                        category.name
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {editingCategory?.id === category.id ? (
                                        <>
                                            <button onClick={handleUpdate} className="text-green-600 hover:text-green-900 mr-4">Save</button>
                                            <button onClick={() => setEditingCategory(null)} className="text-gray-600 hover:text-gray-900">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditingCategory(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                            <button onClick={() => handleDeleteClick(category)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                title="Delete Category"
                message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
                onConfirm={confirmDelete}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
};

export default AdminCategories;
