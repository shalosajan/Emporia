import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, Layers, ClipboardList, Shield, FileText, LogOut, ExternalLink, Database } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Button from './ui/Button';

const AdminSidebar = () => {
    const { user, logout } = useContext(AuthContext);

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/products', label: 'Products', icon: ShoppingBag },
        { path: '/admin/categories', label: 'Categories', icon: Layers },
        { path: '/admin/orders', label: 'Orders', icon: ClipboardList },
    ];

    // Super Admin Only Items
    const superAdminItems = [
        { path: '/admin/team', label: 'Team', icon: Shield },
        { path: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
    ];

    const NavItem = ({ to, icon: Icon, label }) => (
        <NavLink
            to={to}
            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer relative z-10
                ${isActive
                    ? 'bg-indigo-glow/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] border border-indigo-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }
            `}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </NavLink>
    );

    return (
        <aside className="w-72 bg-glass-surface backdrop-blur-xl border-r border-glass-border flex flex-col h-screen sticky top-0 z-50">
            {/* Header */}
            <div className="p-6 border-b border-glass-border">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Shield className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">Admin</h1>
                        <p className="text-xs text-indigo-400 font-medium tracking-wide">SECURE PORTAL</p>
                    </div>
                </div>
                <div className="mt-4 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-xs text-gray-400">Logged in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Overview</p>
                {navItems.map((item) => (
                    <NavItem key={item.path} {...item} />
                ))}

                {user.is_superuser && (
                    <>
                        <div className="my-6 border-t border-glass-border"></div>
                        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">System</p>
                        {superAdminItems.map((item) => (
                            <NavItem key={item.path} {...item} />
                        ))}
                    </>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-glass-border space-y-3">
                {/* Regular Staff gets Back to Shop */}
                {!user.is_superuser && (
                    <Link to="/" className="flex items-center gap-2 justify-center text-gray-400 hover:text-white transition-colors text-sm py-2">
                        <ExternalLink size={16} />
                        Back to Shop
                    </Link>
                )}

                {/* Superuser gets Backend Admin Link */}
                {user.is_superuser && (
                    <a
                        href="http://localhost:8000/admin/" // Direct link to Django Admin
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 justify-center text-indigo-400 hover:text-indigo-300 transition-colors text-sm py-2 font-medium"
                    >
                        <Database size={16} />
                        Backend Database
                    </a>
                )}

                <Button
                    variant="danger"
                    className="w-full justify-start gap-3"
                    onClick={logout}
                >
                    <LogOut size={18} />
                    Logout
                </Button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
