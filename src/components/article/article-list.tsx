// src/components/article-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit, Eye, Calendar, Clock } from 'lucide-react'
import Image from 'next/image'
import type { Article } from '@/types'

export default function ArticleList() {
    const [articles, setArticles] = useState<Article[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            const res = await fetch('/api/articles')
            if (!res.ok) throw new Error('Failed to fetch articles')
            const data = await res.json()
            setArticles(data.articles)
        } catch (err) {
            console.log(err)
            setError('Gagal memuat daftar artikel')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return

        try {
            const res = await fetch('/api/articles', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })

            if (res.ok) {
                setArticles(prev => prev.filter(article => article.id !== id))
            } else {
                throw new Error('Failed to delete article')
            }
        } catch (err) {
            console.log(err)
            setError('Gagal menghapus artikel')
        }
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
            <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
            </div>
        )
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Belum ada artikel yang ditambahkan</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {articles.map((article) => (
                <div
                    key={article.id}
                    className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                    <div className="flex flex-col sm:flex-row">
                        {/* Cover Image */}
                        {article.coverImage && (
                            <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0">
                                <Image
                                    src={article.coverImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {article.title}
                                    </h3>

                                    {/* Meta Information */}
                                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(article.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        {article.published ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Draft
                                            </span>
                                        )}
                                    </div>

                                    {/* Excerpt */}
                                    {article.excerpt && (
                                        <p className="mt-3 text-gray-600 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    <a
                                        href={`/blog/${article.slug}`}
                                        target="_blank"
                                        className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                                        title="Preview"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </a>
                                    <button
                                        onClick={() => {/* Handle edit */ }}
                                        className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Additional Meta */}
                            {article.publishedAt && (
                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Published on{' '}
                                    {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}