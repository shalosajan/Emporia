import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Filter, Eye, EyeOff, Trash2, CheckCircle, Clock } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import ConfirmationModal from '../../components/ConfirmationModal';
import StarRating from '../../components/reviews/StarRating';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal State
    const [actionModal, setActionModal] = useState({ open: false, type: null, reviewId: null });

    const { showAlert } = useAlert();
    const { user } = useAuth();

    // Check permissions
    const canDelete = user?.staff_level === 'SUPER_ADMIN' || user?.is_superuser;

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/reviews/admin/');
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            showAlert("Failed to load reviews.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/api/reviews/admin/${id}/`, { status: newStatus });
            setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
            showAlert(`Review marked as ${newStatus}`, "success");
        } catch (error) {
            console.error("Error updating status:", error);
            showAlert("Failed to update status.", "error");
        }
    };

    const handleDelete = async () => {
        if (!actionModal.reviewId) return;
        try {
            await api.delete(`/api/reviews/admin/${actionModal.reviewId}/`);
            setReviews(reviews.filter(r => r.id !== actionModal.reviewId));
            showAlert("Review deleted.", "success");
            setActionModal({ open: false, type: null, reviewId: null });
        } catch (error) {
            console.error("Error deleting review:", error);
            showAlert("Failed to delete review.", "error");
        }
    };

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.product_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || review.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PUBLISHED': return <Badge variant="success" icon={CheckCircle}>Published</Badge>;
            case 'PENDING': return <Badge variant="warning" icon={Clock}>Pending</Badge>;
            case 'HIDDEN': return <Badge variant="error" icon={EyeOff}>Hidden</Badge>;
            default: return <Badge variant="default">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Review Moderation</h1>
                    <p className="text-gray-400">Manage and moderate customer reviews</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Input
                        placeholder="Search reviews..."
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64"
                    />

                    <div className="flex bg-obsidian-light rounded-lg p-1 border border-white/10">
                        {['ALL', 'PENDING', 'PUBLISHED', 'HIDDEN'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`
                                    px-3 py-1.5 rounded-md text-xs font-medium transition-all
                                    ${statusFilter === filter
                                        ? 'bg-indigo-500 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                {filter.charAt(0) + filter.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredReviews.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Reviews Found</h3>
                            <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <Card key={review.id} className="relative group">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-white text-lg">{review.product_name}</h4>
                                                {getStatusBadge(review.status)}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                                            <span>by <strong className="text-indigo-300">{review.user}</strong></span>
                                            <div className="w-1 h-1 bg-gray-600 rounded-full" />
                                            <div className="flex items-center gap-1">
                                                <StarRating rating={review.rating} size={14} />
                                            </div>
                                        </div>

                                        <p className="text-gray-300 bg-white/5 p-4 rounded-lg border border-white/5 mb-4 italic">
                                            "{review.comment}"
                                        </p>

                                        {review.photo && (
                                            <img
                                                src={review.photo}
                                                alt="Attachment"
                                                className="h-20 w-20 object-cover rounded-lg border border-white/10"
                                            />
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 md:w-40">
                                        {review.status !== 'PUBLISHED' && (
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="w-full justify-start gap-2"
                                                onClick={() => handleUpdateStatus(review.id, 'PUBLISHED')}
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </Button>
                                        )}

                                        {review.status !== 'HIDDEN' && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="w-full justify-start gap-2"
                                                onClick={() => handleUpdateStatus(review.id, 'HIDDEN')}
                                            >
                                                <EyeOff size={16} /> Hide
                                            </Button>
                                        )}

                                        {canDelete && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="w-full justify-start gap-2 mt-auto"
                                                onClick={() => setActionModal({ open: true, type: 'delete', reviewId: review.id })}
                                            >
                                                <Trash2 size={16} /> Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            <ConfirmationModal
                isOpen={actionModal.open}
                onClose={() => setActionModal({ open: false, type: null, reviewId: null })}
                onConfirm={handleDelete}
                title="Delete Review"
                message="Are you sure you want to permanently delete this review? This action cannot be undone."
                confirmText="Delete Review"
                variant="danger"
            />
        </div>
    );
};

export default AdminReviews;
