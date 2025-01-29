// src/components/socials/social-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { Link2, Pencil, Trash2 } from 'lucide-react'
import type { Social } from '@/types'
import SocialForm from './social-form'
import { Alert } from '@/components/ui/Alert'

export default function SocialList() {
    const [socials, setSocials] = useState<Social[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingSocial, setEditingSocial] = useState<Social | null>(null)

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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this social media link?')) return

        try {
            const res = await fetch('/api/socials', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })

            if (!res.ok) throw new Error('Failed to delete')

            setSocials(socials.filter(s => s.id !== id))
        } catch (err) {
            console.error('Error:', err)
            setError('Failed to delete social media link')
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">{error}</Alert>
        )
    }

    if (editingSocial) {
        return (
            <SocialForm
                initialData={{
                    platform: editingSocial.platform,
                    url: editingSocial.url,
                    id: editingSocial.id
                }}
                isEdit={true}
                onSuccess={() => {
                    setEditingSocial(null)
                    fetchSocials()
                }}
            />
        )
    }

    if (socials.length === 0) {
        return (
            <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
                <Link2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No social media links</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new social media link.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
            {socials.map((social) => (
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
                                onClick={() => setEditingSocial(social)}
                                className="p-2 text-gray-400 hover:text-indigo-500 rounded-full hover:bg-gray-50"
                                title="Edit"
                            >
                                <Pencil className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(social.id)}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-50"
                                title="Delete"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}