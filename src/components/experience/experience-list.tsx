// src/components/experience/experience-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2, Calendar, Building, MapPin } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'
import ExperienceForm from './experience-form'

interface Experience {
    id: string
    title: string
    company: string
    location: string | null
    startDate: string
    endDate: string | null
    current: boolean
    description: string | null
}

export default function ExperienceList() {
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

    useEffect(() => {
        fetchExperiences()
    }, [])

    const fetchExperiences = async () => {
        try {
            const res = await fetch('/api/experiences')
            if (!res.ok) throw new Error('Failed to fetch experiences')
            const data = await res.json()
            setExperiences(data.experiences)
        } catch (err) {
            console.log(err)
            setError('Gagal memuat data pengalaman kerja')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pengalaman ini?')) return

        try {
            const res = await fetch('/api/experiences', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })

            if (res.ok) {
                setExperiences(prev => prev.filter(exp => exp.id !== id))
            } else {
                throw new Error('Failed to delete experience')
            }
        } catch (err) {
            console.log(err)
            setError('Gagal menghapus pengalaman kerja')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <p>{error}</p>
            </Alert>
        )
    }

    if (experiences.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Belum ada pengalaman kerja yang ditambahkan</p>
            </div>
        )
    }

    if (editingExperience) {
        return (
            <ExperienceForm
                initialData={{
                    title: editingExperience.title,
                    company: editingExperience.company,
                    location: editingExperience.location || '',
                    startDate: new Date(editingExperience.startDate).toISOString().split('T')[0],
                    endDate: editingExperience.endDate 
                        ? new Date(editingExperience.endDate).toISOString().split('T')[0] 
                        : '',
                    current: editingExperience.current,
                    description: editingExperience.description || '',
                    id: editingExperience.id
                }}
                isEdit={true}
                onSuccess={() => {
                    setEditingExperience(null)
                    fetchExperiences()
                }}
            />
        )
    }

    return (
        <div className="space-y-6">
            {experiences.map((experience) => (
                <div key={experience.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{experience.title}</h3>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center text-gray-600">
                                    <Building className="h-4 w-4 mr-2" />
                                    <span>{experience.company}</span>
                                </div>
                                {experience.location && (
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span>{experience.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>
                                        {formatDate(experience.startDate)} -{' '}
                                        {experience.current ? 'Sekarang' : experience.endDate ? formatDate(experience.endDate) : ''}
                                    </span>
                                </div>
                            </div>
                            {experience.description && (
                                <div className="mt-4 text-gray-700">
                                    <p className="whitespace-pre-line">{experience.description}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                onClick={() => setEditingExperience(experience)}
                                title="Edit"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                            <button
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                onClick={() => handleDelete(experience.id)}
                                title="Hapus"
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