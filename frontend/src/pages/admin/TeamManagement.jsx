import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

const TeamManagement = () => {
    const { user: currentUser, impersonate } = useAuth();
    const { showAlert } = useAlert();
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

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
            password: '', // Password mostly optional/hidden on edit
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
                // Prepare update data
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
            showAlert("Failed to save staff. " + (error.response?.data?.detail || ""), 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this staff member? This action is permanent.")) return;
        try {
            await api.delete(`/api/auth/admin/staff/${id}/`);
            // Optimistic update
            setStaffList(staffList.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting staff:", error);
            showAlert("Failed to delete staff.", 'error');
        }
    };

    const handleImpersonate = async (userId) => {
        if (!window.confirm("Are you sure you want to impersonate this staff member? Audit logs will record this.")) return;
        try {
            await impersonate(userId);
            window.location.href = '/admin/dashboard';
        } catch (error) {
            console.error("Impersonation failed:", error);
            showAlert("Impersonation failed: " + (error.response?.data?.detail || ""), 'error');
        }
    };

    if (loading) return <div>Loading Team...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Team Management</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add New Staff
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {staffList.map((staff) => (
                            <tr key={staff.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{staff.username}</div>
                                    <div className="text-sm text-gray-500">{staff.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {staff.staff_profile?.role_level || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {staff.staff_profile?.department || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {staff.is_active ? (
                                        <span className="text-green-600 text-sm">Active</span>
                                    ) : (
                                        <span className="text-red-600 text-sm">Inactive</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {/* Self-Protection: Cannot edit self */}
                                    {staff.id !== currentUser.user_id && (
                                        <>
                                            <button
                                                onClick={() => openEditModal(staff)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(staff.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {staff.id === currentUser.user_id && (
                                        <span className="text-gray-400 italic text-xs">Current User</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Staff' : 'Add New Staff'}</h3>
                        <form onSubmit={handleSubmit}>
                            {!isEditing && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Role Level</label>
                                <select
                                    name="role_level"
                                    value={formData.role_level}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                >
                                    <option value="SUPER_ADMIN">Super Admin</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="SUPPORT">Support</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                >
                                </input>
                            </div>

                            {isEditing && (
                                <div className="mb-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Active Account
                                    </label>
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;
