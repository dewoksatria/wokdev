// src/app/dashboard/socials/page.tsx
'use client'

import { useState } from 'react'
import SocialForm from '@/components/socials/social-form'
import SocialList from '@/components/socials/social-list'
import { Plus, ArrowLeft } from 'lucide-react'

export default function SocialsPage() {
    const [showForm, setShowForm] = useState(false)

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
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Link
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowForm(false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to List
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-6 px-4 sm:px-6">
                {showForm ? (
                    <SocialForm onSuccess={() => setShowForm(false)} />
                ) : (
                    <SocialList />
                )}
            </div>
        </div>
    )
}