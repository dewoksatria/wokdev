// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, CheckCircle, Mail } from 'lucide-react'
import type { User } from '@/types'

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
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
            }
        }

        fetchUser()
    }, [router])

    return (
        <>
            {/* Welcome Section */}
            <div className="px-4 py-5 sm:px-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Selamat datang, {user?.name || 'User'}!
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Ini adalah halaman dashboard Anda. Lihat informasi akun Anda di bawah ini.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6">
                {/* Status Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Home className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Status
                                    </dt>
                                    <dd className="flex items-center text-lg font-semibold text-gray-900">
                                        Active
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Member Since Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-500" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Member Sejak
                                    </dt>
                                    <dd className="flex items-center text-lg font-semibold text-gray-900">
                                        {user?.createdAt ? new Date(user.createdAt).getFullYear() : '-'}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Mail className="h-6 w-6 text-pink-500" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Email
                                    </dt>
                                    <dd className="mt-1 text-sm font-semibold text-gray-900 truncate">
                                        {user?.email}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Content Section */}
            <div className="mt-8 bg-white shadow rounded-lg px-4 py-5 sm:p-6 mx-4 sm:mx-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Aktivitas Terkini
                </h3>
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-center h-48 text-gray-500">
                        Belum ada aktivitas untuk ditampilkan
                    </div>
                </div>
            </div>
        </>
    )
}