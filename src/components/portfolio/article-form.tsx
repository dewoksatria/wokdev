// src/components/portfolio/article-form.tsx
'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import type { ArticleFormData } from '@/types'

interface ArticleFormProps {
    onSuccess?: () => void
    initialData?: ArticleFormData & { id?: string, coverImage?: string }
    isEdit?: boolean
}

export default function ArticleForm({ onSuccess, initialData, isEdit = false }: ArticleFormProps) {
    const [formData, setFormData] = useState<ArticleFormData>({
        title: initialData?.title || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        published: initialData?.published || false,
        coverImage: null
    })
    const [previewUrl, setPreviewUrl] = useState<string>(initialData?.coverImage || '') // Store URL string
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData(prev => ({ ...prev, coverImage: file }))
            // Create a URL for the preview
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    // Cleanup function to revoke object URL
    const cleanupPreviewUrl = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            const formDataToSend = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== '') {
                    formDataToSend.append(key, value)
                }
            })

            if (isEdit && initialData?.id) {
                formDataToSend.append('id', initialData.id)
            }

            const url = '/api/portfolio/article'
            const method = isEdit ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                body: formDataToSend,
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(isEdit ? 'Artikel berhasil diperbarui' : 'Artikel berhasil ditambahkan')
                if (!isEdit) {
                    setFormData({
                        title: '',
                        content: '',
                        excerpt: '',
                        published: false,
                        coverImage: null
                    })
                    cleanupPreviewUrl()
                    setPreviewUrl('')
                }
                onSuccess?.()
            } else {
                setError(data.error)
            }
        } catch (err) {
            console.log(err)
            setError('Terjadi kesalahan saat menyimpan artikel')
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
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

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Cover Image
                        </label>
                        <div className="mt-2 flex flex-col space-y-4">
                            {previewUrl ? (
                                <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={previewUrl}
                                        alt="Cover preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-64 w-full border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                                    <div className="text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-1 text-sm text-gray-500">Upload cover image</p>
                                    </div>
                                </div>
                            )}
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none w-fit">
                                <Upload className="h-5 w-5 mr-2" />
                                {previewUrl ? 'Change Image' : 'Select Image'}
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
                            Judul Artikel
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Masukkan judul artikel"
                        />
                    </div>

                    {/* Excerpt/Summary */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Ringkasan
                        </label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Tuliskan ringkasan singkat artikel"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Ringkasan singkat yang akan ditampilkan di preview artikel
                        </p>
                    </div>

                    {/* Main Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Konten Artikel
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={12}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                            placeholder="Tulis konten artikel Anda di sini..."
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Mendukung format Markdown untuk styling konten
                        </p>
                    </div>

                    {/* Published Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="published"
                            checked={formData.published}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Publish artikel sekarang
                        </label>
                    </div>

                    {/* Submit Buttons */}
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
                            {isLoading
                                ? 'Menyimpan...'
                                : isEdit
                                    ? 'Update Artikel'
                                    : formData.published
                                        ? 'Publish Artikel'
                                        : 'Simpan Draft'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}