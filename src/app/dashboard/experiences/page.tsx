// src/app/dashboard/experiences/page.tsx
'use client'

import { useState } from 'react'
import ExperienceForm from '@/components/experience/experience-form'
import ExperienceList from '@/components/experience/experience-list'
import { Plus } from 'lucide-react'

export default function ExperiencesPage() {
    const [showForm, setShowForm] = useState(false)

    return (
        <div>
            {/* Page Header */}
            <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Pengalaman Kerja</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Kelola riwayat pengalaman kerja Anda
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Tambah Pengalaman
                    </button>
                </div>
            </div>

            <div className="mt-6">
                {showForm && (
                    <div className="mb-8">
                        <ExperienceForm onSuccess={() => setShowForm(false)} />
                    </div>
                )}

                <ExperienceList />
            </div>
        </div>
    )
}