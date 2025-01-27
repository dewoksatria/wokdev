'use client'

import { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'
import Image from 'next/image'

interface FormData {
    bio: string
    headline: string
    location: string
    website: string
    avatar: File | null
}

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [preview, setPreview] = useState<string>('')
    const [formData, setFormData] = useState<FormData>({
        bio: '',
        headline: '',
        location: '',
        website: '',
        avatar: null
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/portfolio/profile')
            if (!res.ok) throw new Error('Failed to fetch profile')
            const data = await res.json()
            
            if (data.profile) {
                setFormData({
                    bio: data.profile.bio || '',
                    headline: data.profile.headline || '',
                    location: data.profile.location || '',
                    website: data.profile.website || '',
                    avatar: null
                })
                if (data.profile.avatar) {
                    setPreview(data.profile.avatar)
                }
            }
        } catch (err) {
            console.error('Error:', err)
            setError('Failed to load profile data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const formDataToSend = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                formDataToSend.append(key, value)
            }
        })

        try {
            const res = await fetch('/api/portfolio/profile', {
                method: 'PUT',
                body: formDataToSend
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update profile')
            }

            // Update preview if new avatar was uploaded
            if (data.profile.avatar) {
                setPreview(data.profile.avatar)
            }
            setSuccess('Profile updated successfully')
        } catch (err) {
            console.error('Error:', err)
            setError(err instanceof Error ? err.message : 'Failed to update profile')
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }))
            setPreview(URL.createObjectURL(file))
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div>
            {/* Page Header */}
            <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Update your profile information and portfolio details
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 px-4 sm:px-6">
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

                <div className="bg-white shadow rounded-lg">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
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

                            {/* Professional Headline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Professional Headline
                                </label>
                                <input
                                    type="text"
                                    value={formData.headline}
                                    onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Full Stack Developer | UI/UX Designer"
                                />
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Bio
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="City, Country"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}