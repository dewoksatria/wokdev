// src/components/project/project-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit, Calendar, Link as LinkIcon, Github } from 'lucide-react'
import type { Project } from '@/types'
import ProjectForm from './project-form'

const ProjectTechnologies = ({ technologies }: { technologies: string }) => {
    try {
        const techArray = JSON.parse(technologies)
        return (
            <div className="flex flex-wrap gap-2">
                {techArray.map((tech: string, index: number) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        )
    } catch (error) {
        console.error('Error parsing technologies:', error)
        return null
    }
}

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects')
            if (!res.ok) throw new Error('Failed to fetch projects')
            const data = await res.json()
            setProjects(data.projects)
        } catch (err) {
            console.log(err)
            setError('Gagal memuat data project')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus project ini?')) return

        try {
            const res = await fetch('/api/projects', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })

            if (res.ok) {
                setProjects(prev => prev.filter(project => project.id !== id))
            } else {
                throw new Error('Failed to delete project')
            }
        } catch (err) {
            console.log(err)
            setError('Gagal menghapus project')
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

    if (projects.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Belum ada project yang ditambahkan</p>
            </div>
        )
    }

    if (editingProject) {
        return (
            <ProjectForm
                initialData={{
                    title: editingProject.title,
                    description: editingProject.description || '',
                    image: null, // We can't pass the File object from existing image
                    link: editingProject.link || '',
                    githubUrl: editingProject.githubUrl || '',
                    startDate: new Date(editingProject.startDate).toISOString().split('T')[0],
                    endDate: editingProject.endDate ? new Date(editingProject.endDate).toISOString().split('T')[0] : '',
                    technologies: editingProject.technologies,
                }}
                isEdit={true}
                onSuccess={() => {
                    setEditingProject(null)
                    fetchProjects()
                }}
            />
        )
    }

    return (
        <div className="space-y-6">
            {projects.map((project) => (
                <div key={project.id} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {project.title}
                                </h3>

                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <time dateTime={project.startDate.toString()}>
                                            {new Date(project.startDate).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </time>
                                        {project.endDate && (
                                            <>
                                                <span className="mx-2">-</span>
                                                <time dateTime={project.endDate.toString()}>
                                                    {new Date(project.endDate).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long'
                                                    })}
                                                </time>
                                            </>
                                        )}
                                    </div>

                                    {project.link && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <LinkIcon className="h-4 w-4 mr-2" />
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-500"
                                            >
                                                Live Demo
                                            </a>
                                        </div>
                                    )}

                                    {project.githubUrl && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Github className="h-4 w-4 mr-2" />
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-500"
                                            >
                                                Source Code
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {project.description && (
                                    <p className="mt-4 text-gray-600 text-sm">
                                        {project.description}
                                    </p>
                                )}

                                {project.technologies && (
                                    <div className="mt-4">
                                        <ProjectTechnologies technologies={project.technologies} />
                                    </div>
                                )}
                            </div>

                            <div className="ml-4 flex-shrink-0 space-x-2">
                                <button
                                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                    onClick={() => setEditingProject(project)}
                                    title="Edit"
                                >
                                    <Edit className="h-5 w-5" />
                                </button>
                                <button
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    onClick={() => handleDelete(project.id)}
                                    title="Hapus"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}