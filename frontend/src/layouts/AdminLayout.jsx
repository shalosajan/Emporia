import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative flex h-screen w-screen overflow-hidden bg-obsidian text-gray-100">
            {/* 1. Global Background (Behind Everything) */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Mobile Sidebar Toggle Button */}
            <button
                className="absolute top-4 left-4 z-[60] p-2 bg-glass-surface backdrop-blur-md rounded-lg border border-glass-border md:hidden text-gray-300"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 2. Sidebar (Responsive) */}
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 h-full w-72 flex-shrink-0 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:block
            `}>
                <AdminSidebar onCloseMobile={() => setIsSidebarOpen(false)} />
            </div>

            {/* 3. Main Content Area */}
            <main className="relative z-10 flex-1 overflow-y-auto custom-scrollbar w-full p-4 pt-20 md:p-8 md:pt-8">
                <div className="max-w-7xl mx-auto animate-fade-in pb-20">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
