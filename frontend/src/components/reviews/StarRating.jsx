import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating, size = 16, interactive = false, onRate }) => {
    // Round to nearest 0.5 for display
    const roundedRating = Math.round(rating * 2) / 2;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFull = star <= roundedRating;
                const isHalf = !isFull && star - 0.5 === roundedRating;

                return (
                    <div
                        key={star}
                        className={`
                             transition-colors duration-200
                            ${interactive ? 'cursor-pointer hover:scale-110' : ''}
                            ${(isFull || isHalf) ? 'text-yellow-400' : 'text-gray-600'}
                        `}
                        onClick={() => interactive && onRate && onRate(star)}
                    >
                        {isHalf ? (
                            <div className="relative">
                                <StarHalf size={size} fill="currentColor" />
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-transparent" />
                            </div>
                        ) : (
                            <Star
                                size={size}
                                fill={isFull ? "currentColor" : "none"}
                            // strokeWidth={interactive ? 2 : 1.5}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;
