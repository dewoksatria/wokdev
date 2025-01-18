// src/app/dashboard/change-password/page.tsx
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
    const [formData, setFormData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Password baru dan konfirmasi password tidak cocok')
            return
        }

        if (formData.newPassword.length < 6) {
            setError('Password baru harus minimal 6 karakter')
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(data.message)
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengubah password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Ubah Password
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                            <p className="text-sm text-green-600">{success}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Password Saat Ini
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            required
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            Password Baru
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            required
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}