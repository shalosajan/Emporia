import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit, Trash2, Package, DollarSign, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

// Mock Data for the chart
const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/seller/dashboard/');
        setProducts(response.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError("You are not an approved seller.");
        } else {
          setError("Failed to load dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSellerProducts();
  }, []);

  const handleDeleteClick = (slug) => {
    setProductToDelete(slug);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/api/seller/dashboard/${productToDelete}/`);
      setProducts(products.filter(p => p.slug !== productToDelete));
      setIsModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  // Stats
  const totalValue = products.reduce((acc, curr) => acc + (parseFloat(curr.price) * curr.stock), 0);
  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);

  if (loading) return <div className="p-10 text-center"><div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full mx-auto"></div></div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Vendor Command Center</h1>
          <p className="text-gray-400">Welcome back, Commander {user.username}</p>
        </div>
        <Link to="/seller/add-product">
          <Button variant="primary" className="gap-2">
            <Plus size={18} />
            Add Artifact
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase font-bold">Total Artifacts</p>
            <p className="text-2xl font-bold text-white">{products.length}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase font-bold">Inven. Value</p>
            <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase font-bold">Total Units</p>
            <p className="text-2xl font-bold text-white">{totalStock}</p>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="p-6 mb-8 h-80">
        <h3 className="text-lg font-bold text-white mb-4">Traffic Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="name" stroke="#ffffff50" />
            <YAxis stroke="#ffffff50" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#ffffff20', color: '#fff' }}
              itemStyle={{ color: '#6366F1' }}
            />
            <Area type="monotone" dataKey="sales" stroke="#6366F1" fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Products Table */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Active Listings</h3>
          <Badge variant="neutral">{products.length} Items</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Artifact</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded bg-white/10 object-cover" />
                    <span className="font-medium text-white">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-indigo-300">${product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <Badge variant={product.stock > 0 ? 'success' : 'error'}>
                      {product.stock > 0 ? 'Active' : 'Out of Stock'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/seller/edit-product/${product.slug}`}>
                        <Button variant="ghost" size="sm" className="p-2 text-blue-400 hover:text-blue-300">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-500 hover:text-red-400"
                        onClick={() => handleDeleteClick(product.slug)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No artifacts deployed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Artifact"
        message="Are you sure you want to decommission this artifact? This action cannot be undone."
      />
    </div>
  );
}

export default SellerDashboard;
