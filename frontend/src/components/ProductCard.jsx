import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/products/${product.slug}`} className="block h-full">
            <Card hoverEffect className="h-full flex flex-col group relative overflow-hidden">
                {/* Image Container with Pan Effect */}
                <div className="relative h-64 overflow-hidden bg-white/5">
                    {product.image ? (
                        <motion.img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                            No Image
                        </div>
                    )}

                    {/* Floating Stock Badge */}
                    <div className="absolute top-4 right-4">
                        {product.stock > 0 ? (
                            <Badge variant={product.stock < 10 ? 'warning' : 'success'}>
                                {product.stock} left
                            </Badge>
                        ) : (
                            <Badge variant="error">Out of Stock</Badge>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                            {product.category_name}
                        </span>
                        <span className="text-xl font-bold text-white tracking-tight">
                            ${product.price}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-100 mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                        {product.description}
                    </p>

                    <Button variant="primary" className="w-full gap-2 group-hover:shadow-indigo-500/50">
                        <ShoppingBag size={18} />
                        View Details
                    </Button>
                </div>
            </Card>
        </Link>
    );
};

export default ProductCard;
