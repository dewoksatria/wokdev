// src/app/dashboard/layout.tsx
'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
    Home, 
    LogOut, 
    Briefcase, 
    FolderKanban,
    Code2,
    Link as LinkIcon,
    Settings,
    User,
    Contact,
    FileText,
    MessageCircle,
} from 'lucide-react'
import type { User as UserType } from '@/types'

interface LayoutProps {
    children: React.ReactNode
}

const sidebarLinks = [
    {
        title: 'Data Master',
        links: [
            {
                name: 'Pengalaman',
                href: '/dashboard/experiences',
                icon: Briefcase
            },
            {
                name: 'Projects',
                href: '/dashboard/projects',
                icon: FolderKanban
            },
            {
                name: 'Skills',
                href: '/dashboard/skills',
                icon: Code2
            },
            {
                name: 'Articles',
                href: '/dashboard/articles',
                icon: FileText
            },
            {
                name: 'Social Media',
                href: '/dashboard/socials',
                icon: LinkIcon
            },
            {
                name: 'Messages',
                href: '/dashboard/messages',
                icon: MessageCircle
            }
        ]
    },
    {
        title: 'Pengaturan',
        links: [
            {
                name: 'Profile',
                href: '/dashboard/profile',
                icon: User
            },
            {
                name: 'Account Settings',
                href: '/dashboard/settings',
                icon: Settings
            },
            {
                name: 'Change Password',
                href: '/dashboard/change-password',
                icon: Contact
            }
        ]
    }
]

export default function DashboardLayout({ children }: LayoutProps) {
    const [user, setUser] = React.useState<UserType | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const router = useRouter()
    const pathname = usePathname()

    React.useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/user')
                if (!res.ok) {
                    throw new Error('Not authenticated')
                }
                const data = await res.json()
                setUser(data.user)
            } catch (error) {
                console.log(error)
                router.push('/login')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [router])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg fixed left-0 h-full">
                <div className="h-16 flex items-center px-6 border-b">
                    <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                        Dashboard
                    </Link>
                </div>
                <nav className="mt-4 px-4 overflow-y-auto h-[calc(100vh-4rem)]">
                    <Link 
                        href="/dashboard" 
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            pathname === '/dashboard' 
                                ? 'text-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                    >
                        <Home className="h-5 w-5 mr-3" />
                        Overview
                    </Link>

                    {sidebarLinks.map((section, idx) => (
                        <div key={idx} className="mt-8">
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <div className="mt-4 space-y-1">
                                {section.links.map((link) => {
                                    const Icon = link.icon
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                                pathname === link.href
                                                    ? 'text-indigo-600 bg-indigo-50'
                                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5 mr-3" />
                                            {link.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Navbar */}
                <nav className="bg-white shadow-sm fixed right-0 left-64 h-16 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="flex justify-between items-center h-full">
                            <div className="flex items-center">
                                <span className="text-gray-600">{user?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="pt-16">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}