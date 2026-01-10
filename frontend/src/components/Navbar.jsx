import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { ShoppingBag, LogOut, LayoutDashboard, ShieldCheck, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="sticky top-0 z-40 bg-obsidian/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent w-fit z-50 relative">
          Emporia
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Home
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors group">
            <ShoppingBag size={20} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-glow text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                {getCartCount()}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {/* Vertical Divider */}
              <div className="h-6 w-px bg-white/10 mx-2"></div>

              {/* Seller Dashboard */}
              {user.role === 'SELLER' && (
                <Link to="/seller/dashboard" className="text-gray-400 hover:text-white transition-colors" title="Vendor Dashboard">
                  <LayoutDashboard size={20} />
                </Link>
              )}

              {/* Admin Link */}
              {(user.is_staff || user.is_superuser) && (
                <Link to="/admin/dashboard" className="text-red-400 hover:text-red-300 transition-colors" title="Admin Panel">
                  <ShieldCheck size={20} />
                </Link>
              )}

              {/* Order History Link */}
              <Link to="/orders/history" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                My Orders
              </Link>

              <div className="flex items-center gap-3">
                <Link to={user.role === 'SELLER' ? "/seller/dashboard" : "/profile"} className="text-sm font-medium text-gray-300 hover:text-white">
                  {user.username}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2">
                  <LogOut size={18} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle & Cart */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Cart (Visible on Mobile) */}
          <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors group">
            <ShoppingBag size={20} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-glow text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                {getCartCount()}
              </span>
            )}
          </Link>

          <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none z-50">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-obsidian border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              <Link to="/" onClick={toggleMenu} className="text-gray-300 hover:text-white py-2 text-lg font-medium border-b border-white/5">
                Home
              </Link>

              {user ? (
                <>
                  <Link to="/orders/history" onClick={toggleMenu} className="text-gray-300 hover:text-white py-2 text-lg font-medium border-b border-white/5">
                    My Orders
                  </Link>
                  <Link to="/profile" onClick={toggleMenu} className="text-gray-300 hover:text-white py-2 text-lg font-medium border-b border-white/5 block">
                    Profile ({user.username})
                  </Link>

                  {user.role === 'SELLER' && (
                    <Link to="/seller/dashboard" onClick={toggleMenu} className="text-indigo-400 hover:text-indigo-300 py-2 text-lg font-medium border-b border-white/5 flex items-center gap-2">
                      <LayoutDashboard size={18} /> Vendor Dashboard
                    </Link>
                  )}

                  {(user.is_staff || user.is_superuser) && (
                    <Link to="/admin/dashboard" onClick={toggleMenu} className="text-red-400 hover:text-red-300 py-2 text-lg font-medium border-b border-white/5 flex items-center gap-2">
                      <ShieldCheck size={18} /> Admin Panel
                    </Link>
                  )}

                  <button onClick={handleLogout} className="text-left text-red-500 hover:text-red-400 py-2 text-lg font-medium flex items-center gap-2">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="secondary" className="w-full justify-center">Login</Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button variant="primary" className="w-full justify-center">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;