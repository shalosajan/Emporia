import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

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
                // Pre-fill the form with existing data
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

    if (loading) return <div className="text-center mt-10">Loading Profile...</div>;

    return (
        <div className="container mx-auto max-w-lg p-6 bg-white shadow-md rounded-md mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={profile.first_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={profile.last_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        placeholder="123 Main St"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 font-bold mb-2">City</label>
                        <input
                            type="text"
                            name="city"
                            value={profile.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div className="w-1/2">
                        <label className="block text-gray-700 font-bold mb-2">Postal Code</label>
                        <input
                            type="text"
                            name="postal_code"
                            value={profile.postal_code}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default ProfilePage;
