// src/components/social-form.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link2 } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

interface Social {
    id: string;
    platform: string;
    url: string;
}

const PLATFORM_OPTIONS = [
    'GitHub',
    'LinkedIn',
    'Twitter',
    'Instagram',
    'Facebook',
    'YouTube',
    'Medium',
    'Dev.to',
    'Dribbble',
    'Behance',
    'Personal Website'
];

export default function SocialForm() {
    const [socials, setSocials] = useState<Social[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newSocial, setNewSocial] = useState({
        platform: '',
        url: ''
    });

    useEffect(() => {
        fetchSocials();
    }, []);

    const fetchSocials = async () => {
        try {
            const res = await fetch('/api/socials');
            if (!res.ok) throw new Error('Failed to fetch socials');
            const data = await res.json();
            setSocials(data.socials);
        } catch (err) {
            console.error('Error fetching socials:', err);
            setError('Failed to load social media links');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/socials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSocial),
            });

            if (!res.ok) throw new Error('Failed to add social link');
            
            const data = await res.json();
            setSocials([...socials, data.social]);
            setNewSocial({ platform: '', url: '' });
            setShowForm(false);
            setSuccess('Social media link added successfully');
        } catch (err) {
            console.error('Error adding social:', err);
            setError('Failed to add social media link');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this social media link?')) return;

        try {
            const res = await fetch(`/api/socials`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error('Failed to delete social link');
            setSocials(socials.filter(social => social.id !== id));
            setSuccess('Social media link deleted successfully');
        } catch (err) {
            console.error('Error deleting social:', err);
            setError('Failed to delete social media link');
        }
    };

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Social Media Links
                    </h3>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Link
                    </button>
                </div>

                {error && (
                    <div className="mb-4">
                        <Alert variant="destructive">{error}</Alert>
                    </div>
                )}

                {success && (
                    <div className="mb-4">
                        <Alert>{success}</Alert>
                    </div>
                )}

                {showForm && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Platform
                                </label>
                                <select
                                    value={newSocial.platform}
                                    onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select Platform</option>
                                    {PLATFORM_OPTIONS.map((platform) => (
                                        <option key={platform} value={platform}>
                                            {platform}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    value={newSocial.url}
                                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                                    required
                                    placeholder="https://"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Adding...' : 'Add Link'}
                            </button>
                        </div>
                    </form>
                )}

                {/* List of existing social links */}
                <div className="space-y-4">
                    {socials.map((social) => (
                        <div
                            key={social.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex items-center space-x-3">
                                <Link2 className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">{social.platform}</p>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        {social.url}
                                    </a>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(social.id)}
                                className="p-2 text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}

                    {socials.length === 0 && !showForm && (
                        <p className="text-center text-gray-500 py-4">
                            No social media links added yet
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}