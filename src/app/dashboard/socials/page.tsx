'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Link2, Pencil } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'

interface Social {
    id: string
    platform: string
    url: string
    createdAt: string
    updatedAt: string
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
]

export default function SocialsPage() {
    const [socials, setSocials] = useState<Social[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        id: '',
        platform: '',
        url: ''
    })

    useEffect(() => {
        fetchSocials()
    }, [])

    const fetchSocials = async () => {
        try {
            const res = await fetch('/api/socials')
            if (!res.ok) throw new Error('Failed to fetch socials')
            const data = await res.json()
            setSocials(data.socials)
        } catch (err) {
            console.error('Error:', err)
            setError('Failed to load social media links')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            const method = isEditing ? 'PUT' : 'POST'
            const res = await fetch('/api/socials', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong')
            }

            if (isEditing) {
                setSocials(socials.map(s => s.id === formData.id ? data.social : s))
                setSuccess('Social media link updated successfully')
            } else {
                setSocials([...socials, data.social])
                setSuccess('Social media link added successfully')
            }

            resetForm()
        } catch (err) {
            console.error('Error:', err)
            setError(err instanceof Error ? err.message : 'Failed to save social media link')
        }
    }

    const handleEdit = (social: Social) => {
        setFormData({
            id: social.id,
            platform: social.platform,
            url: social.url
        })
        setIsEditing(true)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this social media link?')) return

        try {
            const res = await fetch('/api/socials', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            if (!res.ok) throw new Error('Failed to delete')

            setSocials(socials.filter(s => s.id !== id))
            setSuccess('Social media link deleted successfully')
        } catch (err) {
            console.error('Error:', err)
            setError('Failed to delete social media link')
        }
    }

    const resetForm = () => {
        setFormData({
            id: '',
            platform: '',
            url: ''
        })
        setShowForm(false)
        setIsEditing(false)
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
                        <h2 className="text-2xl font-bold text-gray-800">Social Media Links</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your social media profiles and professional networks
                        </p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Link
                        </button>
                    )}
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

                {showForm && (
                    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Platform
                                </label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
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
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {isEditing ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
                    {socials.length > 0 ? (
                        socials.map((social) => (
                            <div key={social.id} className="p-6">
                                <div className="flex items-center justify-between">
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
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(social)}
                                            className="p-2 text-gray-400 hover:text-indigo-500 rounded-full hover:bg-gray-50"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(social.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-50"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-8 text-center">
                            <Link2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No social media links</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by adding a new social media link.
                            </p>
                            {!showForm && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Social Media
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}