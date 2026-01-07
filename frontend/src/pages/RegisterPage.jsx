import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Mail, User, Lock, ArrowRight, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    role: 'CUSTOMER',
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    if (formData.password !== formData.password2) {
      setErrors({ detail: 'Security mismatch: Passwords do not correlate.' });
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/auth/register/', formData);
      navigate('/login');
    } catch (err) {
      setErrors(err.response?.data || { detail: 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  const renderErrors = () => {
    if (!errors) return null;
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6">
        <strong className="font-bold block mb-1">Authorization Error:</strong>
        <ul className="list-disc list-inside">
          {Object.entries(errors).map(([key, value]) => (
            <li key={key}>
              {`${key}: ${Array.isArray(value) ? value.join(' ') : value}`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center container mx-auto px-4">
      <Card className="w-full max-w-lg p-8 bg-white/5 border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Initialize Profile
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Join the network to acquire artifacts.</p>
        </div>

        {errors && renderErrors()}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Identity"
            type="email"
            name="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Codename (Username)"
            type="text"
            name="username"
            icon={User}
            value={formData.username}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Access Key"
              type="password"
              name="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Confirm Key"
              type="password"
              name="password2"
              icon={Lock}
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
              Account Designation
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${formData.role === 'CUSTOMER'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
              >
                <User size={18} /> Customer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'SELLER' })}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${formData.role === 'SELLER'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
              >
                <Shield size={18} /> Vendor
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center gap-2 group mt-6"
            isLoading={loading}
          >
            {loading ? 'Registering...' : 'Create Identity'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>

        <div className="text-center pt-6 mt-6 border-t border-white/10">
          <Link to="/login" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
            Already have credentials? <span className="font-semibold text-white">Login</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;