// src/components/project/project-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { Calendar, Link2, Upload } from 'lucide-react'
import type { ProjectFormData } from '@/types'
import Image from 'next/image'

interface ProjectFormProps {
    onSuccess?: () => void
    initialData?: (ProjectFormData & { id?: string, imageUrl?: string })
    isEdit?: boolean
}

export default function ProjectForm({ onSuccess, initialData, isEdit = false }: ProjectFormProps) {
    const [formData, setFormData] = useState<ProjectFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        image: null,
        link: initialData?.link || '',
        githubUrl: initialData?.githubUrl || '',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        technologies: initialData?.technologies || '[]' // Initialize as JSON string
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [preview, setPreview] = useState<string>(initialData?.imageUrl || '')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData(prev => ({ ...prev, image: file }))
            setPreview(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        return () => {
            if (preview && !preview.includes('/')) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    const handleTechnologies = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Convert comma-separated string to JSON string array
        const techArray = e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
        setFormData(prev => ({
            ...prev,
            technologies: JSON.stringify(techArray)
        }))
    }

    const getTechnologiesString = () => {
        try {
            // Parse the JSON string to array and join with commas
            const techArray = JSON.parse(formData.technologies)
            return Array.isArray(techArray) ? techArray.join(', ') : ''
        } catch {
            return ''
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            const formDataToSend = new FormData()
            
            // Add ID if editing
            if (isEdit && initialData?.id) {
                formDataToSend.append('id', initialData.id)
            }

            // Append other form data
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== '') {
                    formDataToSend.append(key, value)
                }
            })

            const res = await fetch('/api/projects', {
                method: isEdit ? 'PUT' : 'POST',
                body: formDataToSend,
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(isEdit ? 'Project berhasil diperbarui' : 'Project berhasil ditambahkan')
                if (!isEdit) {
                    setFormData({
                        title: '',
                        description: '',
                        image: null,
                        link: '',
                        githubUrl: '',
                        startDate: '',
                        endDate: '',
                        technologies: '[]'
                    })
                    setPreview('')
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
                    {isEdit ? 'Edit Project' : 'Tambah Project Baru'}
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

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Project Image
                        </label>
                        <div className="mt-2 flex items-center space-x-6">
                            <div className="relative w-64 h-40 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Project preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Upload className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                <Upload className="h-5 w-5 mr-2" />
                                Upload Image
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Title */}
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

                    {/* Description */}
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

                    {/* URLs */}
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

                    {/* Dates */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                Tanggal Selesai
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technologies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Technologies
                        </label>
                        <input
                            type="text"
                            name="technologies"
                            value={getTechnologiesString()}
                            onChange={handleTechnologies}
                            placeholder="Contoh: React, Node.js, TypeScript"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Pisahkan dengan koma untuk multiple technologies
                        </p>
                    </div>

                    {/* Buttons */}
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