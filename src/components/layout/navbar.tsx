// src/components/layout/navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '../ui/Button'

export default function Navbar() {
    const pathname = usePathname()
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')
    const isDashboard = pathname?.startsWith('/dashboard')

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            window.location.href = '/login'
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    if (isAuthPage) return null

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-indigo-600">
                            MyWebsite
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isDashboard ? (
                            <Button variant="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button>Daftar</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
