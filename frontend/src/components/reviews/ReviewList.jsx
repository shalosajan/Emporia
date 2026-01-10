import React from 'react';
import StarRating from './StarRating';
import { User, CheckCircle } from 'lucide-react';

const ReviewList = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-obsidian border border-white/10 p-6 rounded-xl shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{review.user}</h4>
                                <p className="text-xs text-gray-400">
                                    {new Date(review.created_at).toLocaleDateString()}
                                    {review.is_verified_purchase && (
                                        <span className="ml-2 inline-flex items-center text-green-400 gap-1 bg-green-400/10 px-1.5 py-0.5 rounded text-[10px]">
                                            <CheckCircle size={10} /> Verified Purchase
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {review.comment}
                    </p>

                    {review.photo && (
                        <div className="mt-4">
                            <img
                                src={review.photo}
                                alt="Review attachment"
                                className="h-24 w-24 object-cover rounded-lg border border-white/10 hover:scale-105 transition-transform cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
