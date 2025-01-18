// src/components/portfolio/project-form.tsx
'use client'

import { useState } from 'react'
import { Calendar, Link2 } from 'lucide-react'
import type { ProjectFormData } from '@/types'

interface ProjectFormProps {
    onSuccess?: () => void
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
    const [formData, setFormData] = useState<ProjectFormData>({
        title: '',
        description: '',
        link: '',
        githubUrl: '',
        startDate: '',
        technologies: [],
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleTechnologies = (e: React.ChangeEvent<HTMLInputElement>) => {
        const technologies = e.target.value.split(',').map(tech => tech.trim())
        setFormData(prev => ({
            ...prev,
            technologies
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/portfolio/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess('Project berhasil ditambahkan')
                setFormData({
                    title: '',
                    description: '',
                    link: '',
                    githubUrl: '',
                    startDate: '',
                    technologies: [],
                })
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
                    Tambah Project Baru
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
                            Judul Project
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Deskripsi
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Link Project
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Link2 className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Github URL
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Link2 className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tanggal Mulai
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="block w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Technologies
                        </label>
                        <input
                            type="text"
                            name="technologies"
                            value={formData.technologies.join(', ')}
                            onChange={handleTechnologies}
                            placeholder="Contoh: React, Node.js, TypeScript"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Pisahkan dengan koma untuk multiple technologies
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
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}