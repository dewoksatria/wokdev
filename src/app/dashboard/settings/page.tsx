'use client'

import { useState, useEffect } from 'react'
import { Alert } from '@/components/ui/Alert'

interface User {
    id: string
    name: string
    email: string
    role: string
}

interface FormData {
    name: string
    email: string
}

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: ''
    })

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/settings')
            if (!res.ok) throw new Error('Failed to fetch user data')
            const data = await res.json()
            setUser(data.user)
            setFormData(prev => ({
                ...prev,
                name: data.user.name || '',
                email: data.user.email || ''
            }))
        } catch (err) {
            console.error('Error:', err)
            setError('Failed to load user data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const dataToUpdate = formData
        
        
        // Hanya kirim data yang berubah
        if (formData.name !== user?.name) dataToUpdate.name = formData.name
        if (formData.email !== user?.email) dataToUpdate.email = formData.email

        // Jika tidak ada yang berubah
        if (Object.keys(dataToUpdate).length === 0) {
            setError('No changes to save')
            return
        }

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update settings')
            }

            setSuccess('Settings updated successfully')
            
            // Reset password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }))

            // Refresh user data
            fetchUser()
        } catch (err) {
            console.error('Error:', err)
            setError(err instanceof Error ? err.message : 'Failed to update settings')
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
                        <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Update your account information and password
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
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Your name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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