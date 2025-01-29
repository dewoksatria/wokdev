// src/components/socials/social-form.tsx
'use client'

import { useState } from 'react'
import { Link2 } from 'lucide-react'
import type { SocialFormData } from '@/types'

interface SocialFormProps {
    onSuccess?: () => void
    initialData?: SocialFormData & { id?: string }
    isEdit?: boolean
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

export default function SocialForm({ onSuccess, initialData, isEdit = false }: SocialFormProps) {
    const [formData, setFormData] = useState<SocialFormData>({
        platform: initialData?.platform || '',
        url: initialData?.url || ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            const url = '/api/socials'
            const method = isEdit ? 'PUT' : 'POST'
            const body = isEdit ? { ...formData, id: initialData?.id } : formData

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(isEdit ? 'Social media link updated successfully' : 'Social media link added successfully')
                if (!isEdit) {
                    setFormData({
                        platform: '',
                        url: ''
                    })
                }
                onSuccess?.()
            } else {
                throw new Error(data.error || 'Something went wrong')
            }
        } catch (err) {
            console.error('Error:', err)
            setError(err instanceof Error ? err.message : 'Failed to save social media link')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isEdit ? 'Edit Social Media Link' : 'Add New Social Media Link'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 p-4 rounded-md">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 p-4 rounded-md">
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    )}

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
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10"
                                required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Link2 className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => onSuccess?.()}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}