// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { ROLES, Role } from '@/lib/constants'

export async function POST(req: Request) {
    try {
        const { name, email, password, role = ROLES.STAFF } = await req.json()

        // Basic validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email dan password harus diisi' },
                { status: 400 }
            )
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Format email tidak valid' },
                { status: 400 }
            )
        }

        // Password length validation
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password minimal 6 karakter' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email sudah terdaftar' },
                { status: 400 }
            )
        }

        // Validate role
        if (role && !Object.values(ROLES).includes(role as Role)) {
            return NextResponse.json(
                { error: 'Role tidak valid' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user with role
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role as Role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })

        return NextResponse.json(
            { 
                message: 'Registrasi berhasil',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}