import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Save, Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        address: '',
        city: '',
        postal_code: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/auth/profile/');
                setProfile({
                    first_name: response.data.first_name || '',
                    last_name: response.data.last_name || '',
                    address: response.data.address || '',
                    city: response.data.city || '',
                    postal_code: response.data.postal_code || '',
                });
            } catch (err) {
                setError('Failed to load profile.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        try {
            await api.patch('/api/auth/profile/', profile);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to update profile.');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
    );

    return (
        <div className="container mx-auto max-w-2xl px-6 py-12">

            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-500/20 rounded-full text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <User size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Pilot Profile</h1>
                    <p className="text-gray-400">Manage your identity and shipping coordinates.</p>
                </div>
            </div>

            <Card className="p-8">
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 mb-6 rounded">{error}</div>}
                {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 mb-6 rounded">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="First Designation"
                            name="first_name"
                            value={profile.first_name}
                            onChange={handleChange}
                            placeholder="John"
                        />
                        <Input
                            label="Last Designation"
                            name="last_name"
                            value={profile.last_name}
                            onChange={handleChange}
                            placeholder="Doe"
                        />
                    </div>

                    <div className="border-t border-white/5 pt-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-indigo-400" /> Shipping Coordinates
                        </h3>

                        <div className="space-y-4">
                            <Input
                                label="Address Sector"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                placeholder="123 Galaxy Lane"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="City / Outpost"
                                    name="city"
                                    value={profile.city}
                                    onChange={handleChange}
                                    placeholder="Neo Tokyo"
                                />
                                <Input
                                    label="Postal Key"
                                    name="postal_code"
                                    value={profile.postal_code}
                                    onChange={handleChange}
                                    placeholder="10001"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full justify-center gap-2 mt-4"
                    >
                        <Save size={18} /> Update Data
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default ProfilePage;
