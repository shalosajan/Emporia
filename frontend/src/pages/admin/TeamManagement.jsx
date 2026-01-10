import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { User, Shield, Briefcase, Trash2, Edit2, Plus, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

import ConfirmationModal from '../../components/ConfirmationModal';

const TeamManagement = () => {
    const { user: currentUser, impersonate } = useAuth();
    const { showAlert } = useAlert();
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Delete Confirmation State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        role_level: 'SUPPORT',
        department: '',
        is_active: true
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await api.get('/api/auth/admin/staff/');
            setStaffList(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching staff:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({
            email: '',
            username: '',
            password: '',
            role_level: 'SUPPORT',
            department: '',
            is_active: true
        });
        setModalOpen(true);
    };

    const openEditModal = (staff) => {
        setIsEditing(true);
        setEditId(staff.id);
        const profile = staff.staff_profile || {};
        setFormData({
            email: staff.email,
            username: staff.username,
            password: '',
            role_level: profile.role_level || 'SUPPORT',
            department: profile.department || '',
            is_active: staff.is_active
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const updatePayload = {
                    role_level: formData.role_level,
                    department: formData.department,
                    is_active: formData.is_active
                };
                await api.patch(`/api/auth/admin/staff/${editId}/`, updatePayload);
                showAlert("Staff updated successfully", 'success');
            } else {
                await api.post('/api/auth/admin/staff/', formData);
                showAlert("Staff created successfully", 'success');
            }
            setModalOpen(false);
            fetchStaff();
        } catch (error) {
            console.error("Error saving staff:", error);
            showAlert("Failed to save staff.", 'error');
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.delete(`/api/auth/admin/staff/${itemToDelete}/`);
            setStaffList(staffList.filter(s => s.id !== itemToDelete));
            showAlert("Staff member deleted.", 'success');
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Error deleting staff:", error);
            showAlert("Failed to delete staff.", 'error');
        }
    };

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-white">Team Management</h2>
                <Button onClick={openCreateModal} variant="primary" className="w-full md:w-auto">
                    <Plus size={18} className="mr-2" /> Add New Staff
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffList.map((staff) => (
                    <Card key={staff.id} className="p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-50 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors">
                            <Shield size={64} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{staff.username}</h3>
                                    <p className="text-xs text-gray-400">{staff.email}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                    <span className="text-gray-500 flex items-center gap-2"><Briefcase size={14} /> Role</span>
                                    <Badge variant="primary">{staff.staff_profile?.role_level || 'N/A'}</Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                    <span className="text-gray-500">Department</span>
                                    <span className="text-gray-300">{staff.staff_profile?.department || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <Badge variant={staff.is_active ? 'success' : 'error'}>
                                        {staff.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-2 relative z-20">
                                {staff.id !== currentUser.user_id ? (
                                    <>
                                        <Button size="sm" variant="secondary" className="flex-1" onClick={() => openEditModal(staff)}>
                                            <Edit2 size={16} className="mr-2" /> Edit
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDeleteClick(staff.id)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-xs text-gray-500 italic py-2">
                                        (You cannot edit yourself)
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-[60] px-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-obsidian border border-glass-border rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="text-xl font-bold text-white">{isEditing ? 'Update Profile' : 'Recruit Staff'}</h3>
                                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {!isEditing && (
                                    <>
                                        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                        <Input label="Username" name="username" value={formData.username} onChange={handleInputChange} required />
                                        <Input label="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Role Level</label>
                                    <select
                                        name="role_level"
                                        value={formData.role_level}
                                        onChange={handleInputChange}
                                        className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="SUPER_ADMIN" className="bg-obsidian">Super Admin</option>
                                        <option value="MANAGER" className="bg-obsidian">Manager</option>
                                        <option value="SUPPORT" className="bg-obsidian">Support</option>
                                    </select>
                                </div>

                                <Input label="Department" name="department" value={formData.department} onChange={handleInputChange} />

                                {isEditing && (
                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-indigo-500"
                                        />
                                        <label className="text-sm text-gray-300">Active Account</label>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" variant="primary">{isEditing ? 'Update' : 'Create'}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                title="Remove Staff Member"
                message="Are you sure you want to remove this staff member? This action cannot be undone."
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                confirmText="Remove"
            />
        </div>
    );
};

export default TeamManagement;
