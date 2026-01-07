import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { ShoppingBag, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-obsidian/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent w-fit">
          Emporia
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
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

              {/* Order History Link for all users */}
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
      </div>
    </nav>
  );
}

export default Navbar;