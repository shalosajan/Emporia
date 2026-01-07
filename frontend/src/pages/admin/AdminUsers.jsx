import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

const AdminUsers = () => {
    const { impersonate } = useAuth();
    const { showAlert } = useAlert();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [actionUser, setActionUser] = useState(null); // User being acted upon
    const [actionType, setActionType] = useState(null); // 'approve' or 'block'
    const [impersonateId, setImpersonateId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/auth/admin/users/');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    };

    const handleApproveSeller = async (userId) => {
        try {
            await api.patch(`/api/auth/admin/users/${userId}/`, { seller_approved: true });
            forceUpdateUser(userId, { seller_approved: true });
        } catch (error) {
            console.error("Error approving seller:", error);
            showAlert("Failed to approve seller.", 'error');
        }
    };

    const handleBlockUser = async (user) => {
        // Toggle block status
        const newStatus = !user.is_active;
        try {
            await api.patch(`/api/auth/admin/users/${user.id}/`, { is_active: newStatus });
            forceUpdateUser(user.id, { is_active: newStatus });
        } catch (error) {
            console.error("Error block/unblocking user:", error);
            showAlert("Failed to update user status.", 'error');
        }
    };

    const handleImpersonate = (userId) => {
        setImpersonateId(userId);
        setModalOpen(true);
    };

    const confirmImpersonate = async () => {
        if (!impersonateId) return;
        setModalOpen(false);
        try {
            const user = await impersonate(impersonateId);
            // Navigate based on role
            if (user.role === 'SELLER') {
                window.location.href = '/seller/dashboard';
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            console.error("Impersonation failed:", error);
            showAlert("Impersonation failed.", 'error');
        } finally {
            setImpersonateId(null);
        }
    };

    const forceUpdateUser = (userId, updates) => {
        setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
    }

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">User Management</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                                    <div className="text-sm text-gray-500">Joined: {new Date(user.date_joined).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.is_active ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.role === 'SELLER' && (
                                        user.seller_approved ? (
                                            <span className="text-green-600">Approved</span>
                                        ) : (
                                            <button
                                                onClick={() => handleApproveSeller(user.id)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                            >
                                                Approve
                                            </button>
                                        )
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleBlockUser(user)}
                                        className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                    >
                                        {user.is_active ? 'Block' : 'Unblock'}
                                    </button>
                                    <button
                                        onClick={() => handleImpersonate(user.id)}
                                        className="ml-4 text-purple-600 hover:text-purple-900 inline-flex items-center"
                                        title="Login as User"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                isOpen={modalOpen && !!impersonateId}
                title="Confirm Impersonation"
                message="Are you sure you want to log in as this user? Usage will be audited."
                onConfirm={confirmImpersonate}
                onCancel={() => { setModalOpen(false); setImpersonateId(null); }}
            />
        </div>
    );
};

export default AdminUsers;
