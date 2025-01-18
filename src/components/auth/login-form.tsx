// src/components/auth/login-form.tsx
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Button from '../ui/button'
import Input from '../ui/input'

export default function LoginForm() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (res.ok) {
                router.push('/dashboard')
                router.refresh()
            } else {
                const data = await res.json()
                setError(data.error || 'Login gagal')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
            />

            <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Loading...' : 'Login'}
            </Button>
        </form>
    )
}