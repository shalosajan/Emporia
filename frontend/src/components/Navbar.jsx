import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo / Home Link */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          Emporia
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-4 items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>

          <Link to="/cart" className="relative text-gray-600 hover:text-gray-800">
            <span>Cart</span>
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          </Link>

          {user ? (
            <>
              {/* Seller Dashboard Link */}
              {user.role === 'SELLER' && (
                <Link to="/seller/dashboard" className="text-gray-600 hover:text-gray-800">
                  Dashboard
                </Link>
              )}

              {/* My Orders Link */}
              <Link to="/orders/history" className="text-gray-600 hover:text-gray-800">
                My Orders
              </Link>

              <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                My Profile
              </Link>

              <span className="text-gray-700">Hi, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;