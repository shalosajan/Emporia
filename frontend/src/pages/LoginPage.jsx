import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await login(email, password);
      if (user) {
        if (user.role === 'SELLER') {
          navigate('/seller/dashboard');
        } else if (user.role === 'STAFF') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
      <Card className="w-full max-w-md p-8 bg-white/5 border-white/10 hover:shadow-cyan-glass/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            System Access
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your credentials to proceed.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 flex items-center justify-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Identity"
            type="email"
            icon={Mail}
            placeholder="pilot@emporia.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Security Token"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center gap-2 group"
            isLoading={loading}
          >
            {loading ? 'Initializing...' : 'Authenticate'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </Button>

          <div className="text-center pt-4 border-t border-white/10">
            <Link to="/register" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
              New to Emporia? <span className="font-semibold text-white">Initialize Account</span>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;