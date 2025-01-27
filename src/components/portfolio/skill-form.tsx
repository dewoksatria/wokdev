// src/components/portfolio/skill-form.tsx
'use client'

import { useState } from 'react'
import type { SkillFormData } from '@/types'
import { Star } from 'lucide-react'

interface SkillFormProps {
    onSuccess?: () => void
    initialData?: SkillFormData & { id?: string }
    isEdit?: boolean
}

const SKILL_CATEGORIES = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Mobile',
    'UI/UX',
    'Tools',
    'Languages',
    'Frameworks',
    'Other'
].sort() // Sort alphabetically for better UX

export default function SkillForm({ onSuccess, initialData, isEdit = false }: SkillFormProps) {
    const [formData, setFormData] = useState<SkillFormData>({
        name: initialData?.name || '',
        level: initialData?.level || 1,
        category: initialData?.category || SKILL_CATEGORIES[0]
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'level' ? parseInt(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            const url = '/api/portfolio/skill'
            const method = isEdit ? 'PUT' : 'POST'
            const body = isEdit ? { ...formData, id: initialData?.id } : formData

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(isEdit ? 'Skill berhasil diperbarui' : 'Skill berhasil ditambahkan')
                if (!isEdit) {
                    setFormData({
                        name: '',
                        level: 1,
                        category: SKILL_CATEGORIES[0]
                    })
                }
                onSuccess?.()
            } else {
                setError(data.error)
            }
        } catch (err) {
            console.log(err)
            setError('Terjadi kesalahan saat menyimpan data')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isEdit ? 'Edit Skill' : 'Tambah Skill Baru'}
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
                            Nama Skill
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Contoh: React.js, Python, Docker, etc"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Kategori
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            {SKILL_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Level Keahlian
                        </label>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, level: value }))}
                                    className={`p-2 rounded-full transition-colors ${value <= formData.level
                                            ? 'text-yellow-400 hover:text-yellow-500'
                                            : 'text-gray-300 hover:text-gray-400'
                                        }`}
                                >
                                    <Star className="h-6 w-6 fill-current" />
                                </button>
                            ))}
                            <span className="text-sm text-gray-500 ml-2">
                                Level {formData.level}/5
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Klik bintang untuk memilih level keahlian (1-5)
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => onSuccess?.()}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Menyimpan...' : isEdit ? 'Update' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}