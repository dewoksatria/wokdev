// src/components/portfolio/skill-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit, Star } from 'lucide-react'
import type { Skill } from '@/types'
import SkillForm from './skill-form'

export default function SkillList() {
    const [skills, setSkills] = useState<Skill[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/portfolio/skill')
            if (!res.ok) throw new Error('Failed to fetch skills')
            const data = await res.json()
            setSkills(data.skills)
        } catch (err) {
            console.log(err)
            setError('Gagal memuat data skill')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus skill ini?')) return

        try {
            const res = await fetch('/api/portfolio/skill', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })

            if (res.ok) {
                setSkills(prev => prev.filter(skill => skill.id !== id))
            } else {
                throw new Error('Failed to delete skill')
            }
        } catch (err) {
            console.log(err)
            setError('Gagal menghapus skill')
        }
    }

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
    }, {} as Record<string, Skill[]>)

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
            </div>
        )
    }

    if (skills.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Belum ada skill yang ditambahkan</p>
            </div>
        )
    }

    if (editingSkill) {
        return (
            <SkillForm
                initialData={editingSkill}
                isEdit={true}
                onSuccess={() => {
                    setEditingSkill(null)
                    fetchSkills()
                }}
            />
        )
    }

    return (
        <div className="space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {category}
                        </h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {categorySkills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="relative border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {skill.name}
                                            </h4>
                                            <div className="flex items-center mt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-4 w-4 ${
                                                            star <= skill.level
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                                <span className="ml-2 text-xs text-gray-500">
                                                    Level {skill.level}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingSkill(skill)}
                                                className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(skill.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}