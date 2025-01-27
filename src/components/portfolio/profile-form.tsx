// src/components/portfolio/profile-form.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { Alert } from '@/components/ui/Alert';

interface ProfileFormData {
    bio: string;
    headline: string;
    location: string;
    website: string;
    avatar: File | null;
}

export default function ProfileForm() {
    const [formData, setFormData] = useState<ProfileFormData>({
        bio: '',
        headline: '',
        location: '',
        website: '',
        avatar: null
    });
    const [preview, setPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/portfolio/profile');
            if (res.ok) {
                const data = await res.json();
                if (data.profile) {
                    setFormData({
                        ...data.profile,
                        avatar: null // Reset file input
                    });
                    if (data.profile.avatar) {
                        setPreview(data.profile.avatar);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile data');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const formDataToSend = new FormData();
        (Object.keys(formData) as Array<keyof ProfileFormData>).forEach(key => {
            const value = formData[key];
            if (value !== null) {
                formDataToSend.append(key, value);
            }
        });

        try {
            const res = await fetch('/api/portfolio/profile', {
                method: 'PUT',
                body: formDataToSend,
            });

            if (res.ok) {
                setSuccess('Profile updated successfully');
                fetchProfile(); // Refresh data
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            console.log(err)
            setError('An error occurred while updating profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <p>{error}</p>
                        </Alert>
                    )}

                    {success && (
                        <Alert>
                            <p className="text-green-800">{success}</p>
                        </Alert>
                    )}

                    {/* Avatar Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Profile Picture
                        </label>
                        <div className="mt-2 flex items-center space-x-6">
                            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Avatar preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Upload className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                <Upload className="h-5 w-5 mr-2" />
                                Change Photo
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Headline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Professional Headline
                        </label>
                        <input
                            type="text"
                            value={formData.headline || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-800 placeholder:text-gray-500"
                            placeholder="e.g. Full Stack Developer | UI/UX Designer"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-800 placeholder:text-gray-500"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-800 placeholder:text-gray-500"
                            placeholder="e.g. San Francisco, CA"
                        />
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Website
                        </label>
                        <input
                            type="url"
                            value={formData.website || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-800 placeholder:text-gray-500"
                            placeholder="https://yourwebsite.com"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}