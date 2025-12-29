import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-gray-700' : 'hover:bg-gray-700';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <p className="text-sm text-gray-400 mt-1">Superuser: {user.username}</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link to="/admin/dashboard" className={`block px-4 py-2 rounded transition-colors ${isActive('/admin/dashboard')}`}>
                        Dashboard Overview
                    </Link>
                    <Link to="/admin/users" className={`block px-4 py-2 rounded transition-colors ${isActive('/admin/users')}`}>
                        User Management
                    </Link>
                    <Link to="/admin/products" className={`block px-4 py-2 rounded transition-colors ${isActive('/admin/products')}`}>
                        Products
                    </Link>
                    <Link to="/admin/categories" className={`block px-4 py-2 rounded transition-colors ${isActive('/admin/categories')}`}>
                        Categories
                    </Link>
                    <Link to="/admin/orders" className={`block px-4 py-2 rounded transition-colors ${isActive('/admin/orders')}`}>
                        Orders
                    </Link>

                    {/* Only Visible to Super Admins */}
                    {user.staff_level === 'SUPER_ADMIN' && (
                        <Link to="/admin/team" className={`block px-4 py-2 rounded transition-colors ${isActive('/admin/team')}`}>
                            Team Management
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={logout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                    <Link to="/" className="block text-center text-gray-400 hover:text-white mt-4 text-sm">
                        Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
