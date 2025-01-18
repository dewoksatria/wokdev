// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Github, ExternalLink, Mail, MapPin, Calendar } from 'lucide-react'
import type { User, Experience, Project, Skill, Profile } from '@/types'

interface UserData {
  user: User
  profile: Profile | null
  experiences: Experience[]
  projects: Project[]
  skills: Skill[]
}

export default function Home() {
  const [data, setData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        const res = await fetch('/api/portfolio')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolioData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {data?.profile?.headline || data?.user?.name || 'Welcome'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {data?.profile?.bio || 'Frontend Developer & UI/UX Designer'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-x-4 text-sm text-gray-500">
              {data?.profile?.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {data.profile.location}
                </div>
              )}
              <a href={`mailto:${data?.user?.email}`} className="flex items-center hover:text-indigo-600">
                <Mail className="h-4 w-4 mr-1" />
                {data?.user?.email}
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={data?.profile?.website || '#'}
                target="_blank"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                View Resume
              </Link>
              <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                Contact Me <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Experience</h2>
          <div className="space-y-8">
            {data?.experiences?.slice(0, 3).map((experience) => (
              <div key={experience.id} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">{experience.title}</h3>
                <div className="mt-2 text-gray-600">
                  <p className="font-medium">{experience.company}</p>
                  <div className="flex items-center text-sm mt-1 text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(experience.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                    {' - '}
                    {experience.current ? 'Present' : experience.endDate && new Date(experience.endDate).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                {experience.description && (
                  <p className="mt-4 text-gray-600">{experience.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data?.projects?.slice(0, 4).map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                {project.description && (
                  <p className="mt-2 text-gray-600">{project.description}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.skills?.map((skill) => (
              <div key={skill.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{skill.name}</h3>
                  <span className="text-xs font-medium text-gray-500">{skill.level}/5</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">{skill.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Lets Connect</h2>
          <p className="text-gray-600 mb-8">
            I m currently open for new opportunities and collaborations
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}