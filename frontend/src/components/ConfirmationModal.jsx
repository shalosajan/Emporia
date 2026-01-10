import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './ui/Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", variant = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md mx-4 my-6">
                {/* Content */}
                <div className="border border-white/10 rounded-xl shadow-2xl relative flex flex-col w-full bg-obsidian outline-none focus:outline-none overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${variant === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                <AlertTriangle size={20} />
                            </div>
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative p-6 flex-auto">
                        <p className="text-gray-300 text-base leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 border-t border-white/10 gap-3 bg-white/5">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant={variant} // 'danger' or 'primary'
                            onClick={onConfirm}
                            className="shadow-lg"
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
