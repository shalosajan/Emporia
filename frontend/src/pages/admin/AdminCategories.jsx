import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAlert } from '../../context/AlertContext';
import { Tag, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const AdminCategories = () => {
    const { showAlert } = useAlert();
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
            showAlert("Category created successfully", 'success');
        } catch (error) {
            console.error("Error creating category:", error);
            showAlert("Failed to create category", 'error');
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
            showAlert("Category updated successfully", 'success');
        } catch (error) {
            console.error("Error updating category:", error);
            showAlert("Failed to update category", 'error');
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
            showAlert("Category deleted successfully", 'success');
        } catch (error) {
            console.error("Error deleting category:", error);
            showAlert("Failed to delete category", 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-white">Category Management</h2>

            {/* Create Form */}
            <Card className="p-6 mb-8 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <Input
                        label="New Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Ancient Relics"
                        icon={Tag}
                    />
                </div>
                <Button
                    onClick={handleCreate}
                    variant="primary"
                    className="w-full md:w-auto h-11"
                    disabled={!newCategoryName.trim()}
                >
                    <Plus size={18} className="mr-2" /> Add Category
                </Button>
            </Card>

            {/* List - Desktop */}
            <div className="hidden md:block bg-glass-surface backdrop-blur-xl border border-glass-border rounded-xl overflow-hidden shadow-2xl">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-indigo-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-transparent">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{category.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {editingCategory?.id === category.id ? (
                                        <Input
                                            value={editingCategory.name}
                                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                            className="h-8 text-sm"
                                        />
                                    ) : (
                                        category.name
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    <Badge variant="ghost">{category.slug}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                    {editingCategory?.id === category.id ? (
                                        <>
                                            <Button size="sm" variant="success" onClick={handleUpdate}><Save size={16} /></Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}><X size={16} /></Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingCategory(category)} className="text-indigo-400"><Edit2 size={16} /></Button>
                                            <Button size="sm" variant="danger" onClick={() => handleDeleteClick(category)}><Trash2 size={16} /></Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* List - Mobile */}
            <div className="md:hidden space-y-4">
                {categories.map((category) => (
                    <Card key={category.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-500">#{category.id}</span>
                            <div className="flex gap-2">
                                {editingCategory?.id === category.id ? (
                                    <>
                                        <Button size="sm" variant="success" onClick={handleUpdate}><Save size={16} /></Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}><X size={16} /></Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingCategory(category)} className="text-indigo-400"><Edit2 size={16} /></Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDeleteClick(category)}><Trash2 size={16} /></Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {editingCategory?.id === category.id ? (
                            <div className="mb-2">
                                <Input
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                    className="h-10"
                                />
                            </div>
                        ) : (
                            <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                        )}

                        <div className="text-sm text-gray-400 font-mono bg-white/5 p-1 rounded w-fit px-2">
                            {category.slug}
                        </div>
                    </Card>
                ))}
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
