import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { Mail, Calendar, ShieldCheck, AlertCircle, Ban, CheckCircle, Eye, User } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

// Internal Modal Component for Reason
const ImpersonationReasonModal = ({ isOpen, onClose, onConfirm, targetUser }) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (reason.length < 5) {
            setError("Reason must be at least 5 characters.");
            return;
        }
        onConfirm(reason);
        setReason("");
        setError("");
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4">
                <div className="border border-white/10 rounded-xl shadow-2xl relative flex flex-col w-full bg-obsidian outline-none focus:outline-none">
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-white/10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Eye className="text-indigo-400" /> Confirm Impersonation
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <span className="text-2xl">×</span>
                        </button>
                    </div>
                    {/* Body */}
                    <div className="relative p-6 flex-auto">
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4 flex gap-3">
                            <AlertCircle className="text-orange-400 flex-shrink-0" size={20} />
                            <p className="text-orange-200 text-sm">
                                You are about to log in as <strong>{targetUser?.email}</strong>.
                                This session will be strictly audited. Please provide a valid reason.
                            </p>
                        </div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Reason for Access <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                            rows="3"
                            placeholder="e.g. Ticket #1234 - Investigating cart error..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 border-t border-white/10 gap-3">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={!reason.trim()}
                        >
                            Start Session
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminUsers = () => {
    const { impersonate, user: currentUser } = useAuth(); // Get current user for permission checks
    const { showAlert } = useAlert();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [userToImpersonate, setUserToImpersonate] = useState(null);

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
            showAlert("Seller approved successfully!", 'success');
        } catch (error) {
            console.error("Error approving seller:", error);
            showAlert("Failed to approve seller.", 'error');
        }
    };

    const handleBlockUser = async (user) => {
        const newStatus = !user.is_active;
        try {
            await api.patch(`/api/auth/admin/users/${user.id}/`, { is_active: newStatus });
            forceUpdateUser(user.id, { is_active: newStatus });
            showAlert(`User ${newStatus ? 'activated' : 'blocked'}.`, 'success');
        } catch (error) {
            console.error("Error block/unblocking user:", error);
            showAlert("Failed to update user status.", 'error');
        }
    };

    const initiateImpersonation = (user) => {
        setUserToImpersonate(user);
        setModalOpen(true);
    };

    const confirmImpersonate = async (reason) => {
        if (!userToImpersonate) return;
        setModalOpen(false);
        try {
            const resultUser = await impersonate(userToImpersonate.id, reason);
            if (resultUser.role === 'SELLER') {
                window.location.href = '/seller/dashboard';
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            console.error("Impersonation failed:", error);
            showAlert("Impersonation failed: " + (error.response?.data?.error || error.message), 'error');
        } finally {
            setUserToImpersonate(null);
        }
    };

    const forceUpdateUser = (userId, updates) => {
        setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
    }

    // Helper: Check if current staff can impersonate target
    const canImpersonate = (targetUser) => {
        if (!currentUser) return false;

        // Super Admin: YES to all
        if (currentUser.is_superuser || currentUser.staff_level === 'SUPER_ADMIN') return true;

        // Manager: YES to Seller
        if (currentUser.staff_level === 'MANAGER' && targetUser.role === 'SELLER') return true;

        // Support: YES to Customer
        if (currentUser.staff_level === 'SUPPORT' && targetUser.role === 'CUSTOMER') return true;

        return false;
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
    );

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">User Management</h2>

            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:block bg-glass-surface backdrop-blur-xl border border-glass-border rounded-xl overflow-hidden shadow-2xl">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">User Identity</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Seller Approval</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-indigo-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-transparent">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                                            <User size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">{user.email}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Calendar size={12} />
                                                Joined {new Date(user.date_joined).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={user.role === 'ADMIN' ? 'error' : user.role === 'SELLER' ? 'warning' : 'primary'}>
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={user.is_active ? 'success' : 'error'} className="flex items-center gap-1 w-fit">
                                        {user.is_active ? <CheckCircle size={12} /> : <Ban size={12} />}
                                        {user.is_active ? 'Active' : 'Blocked'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {user.role === 'SELLER' && (
                                        user.seller_approved ? (
                                            <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14} /> Approved</span>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => handleApproveSeller(user.id)}
                                            >
                                                Approve
                                            </Button>
                                        )
                                    )}
                                    {user.role !== 'SELLER' && <span className="text-gray-600">-</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                    {canImpersonate(user) && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => initiateImpersonation(user)}
                                            className="text-indigo-400 hover:text-white"
                                            title="Impersonate"
                                        >
                                            <Eye size={18} />
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleBlockUser(user)}
                                        title={user.is_active ? "Block User" : "Unblock User"}
                                    >
                                        <Ban size={18} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MOBILE VIEW (CARDS) --- */}
            <div className="md:hidden space-y-4">
                {users.map((user) => (
                    <Card key={user.id} className="p-5 flex flex-col gap-4">
                        {/* Header: Avatar & Identity */}
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 flex-shrink-0">
                                <User size={24} />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="text-base font-bold text-white truncate">{user.email}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="ghost" className="text-[10px] py-0.5 px-2">
                                        ID: {user.id}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{new Date(user.date_joined).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 bg-white/5 rounded-lg p-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Role</span>
                                <div className="mt-1">
                                    <Badge variant={user.role === 'ADMIN' ? 'error' : user.role === 'SELLER' ? 'warning' : 'primary'} className="w-fit text-xs">
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Status</span>
                                <div className="mt-1">
                                    <Badge variant={user.is_active ? 'success' : 'error'} className="w-fit text-xs flex items-center gap-1">
                                        {user.is_active ? 'Active' : 'Blocked'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Actions Stack */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Impersonate */}
                            {canImpersonate(user) ? (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => initiateImpersonation(user)}
                                    className="w-full justify-center bg-white/5 border border-white/10 hover:bg-white/10"
                                >
                                    <Eye size={16} className="mr-2" /> View As
                                </Button>
                            ) : (
                                <div className="w-full flex items-center justify-center text-xs text-gray-600 bg-white/5 rounded cursor-not-allowed">
                                    Access Restricted
                                </div>
                            )}

                            {/* Block/Unblock */}
                            <Button
                                size="sm"
                                variant={user.is_active ? "danger" : "success"}
                                className="w-full justify-center"
                                onClick={() => handleBlockUser(user)}
                            >
                                {user.is_active ? <Ban size={16} className="mr-2" /> : <CheckCircle size={16} className="mr-2" />}
                                {user.is_active ? 'Block' : 'Activate'}
                            </Button>
                        </div>

                        {/* Seller Approval (Full Width) */}
                        {user.role === 'SELLER' && !user.seller_approved && (
                            <Button
                                size="sm"
                                variant="primary"
                                className="w-full justify-center"
                                onClick={() => handleApproveSeller(user.id)}
                            >
                                Approve Vendor Account
                            </Button>
                        )}
                    </Card>
                ))}
            </div>

            <ImpersonationReasonModal
                isOpen={modalOpen}
                targetUser={userToImpersonate}
                onClose={() => { setModalOpen(false); setUserToImpersonate(null); }}
                onConfirm={confirmImpersonate}
            />
        </div>
    );
};

export default AdminUsers;
