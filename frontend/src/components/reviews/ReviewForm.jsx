import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Star } from 'lucide-react';
import StarRating from './StarRating';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ReviewForm = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError("Please select a star rating.");
            return;
        }

        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment);
        if (photo) {
            formData.append('photo', photo);
        }

        onSubmit(formData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-obsidian border border-glass-border rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold text-white">Write a Review</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Rating Input */}
                            <div className="flex flex-col items-center gap-2 py-4">
                                <label className="text-sm font-medium text-gray-400">Rate this product</label>
                                <StarRating
                                    rating={rating}
                                    size={32}
                                    interactive={true}
                                    onRate={setRating}
                                />
                                {rating > 0 && (
                                    <span className="text-indigo-400 text-sm font-medium">
                                        {rating === 5 ? "Excellent!" :
                                            rating === 4 ? "Very Good" :
                                                rating === 3 ? "Average" :
                                                    rating === 2 ? "Poor" : "Terrible"}
                                    </span>
                                )}
                            </div>

                            {/* Comment Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Your Review</label>
                                <textarea
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-indigo-500 resize-none placeholder-gray-600 transition-colors"
                                    placeholder="Tell us what you liked or disliked..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Add Photo (Optional)</label>
                                <div className="border border-dashed border-white/20 rounded-lg p-4 hover:bg-white/5 transition-colors text-center cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        {photo ? (
                                            <>
                                                <span className="text-indigo-400 font-medium truncate max-w-[200px]">{photo.name}</span>
                                                <span className="text-xs">Click to change</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={20} />
                                                <span className="text-xs">Click or drag image here</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={isSubmitting}
                                    disabled={rating === 0}
                                >
                                    Submit Review
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReviewForm;
