// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import { Role } from '@/lib/constants'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                name: true
            }
        })

        console.log('User found:', user ? 'yes' : 'no');

        if (!user) {
            return NextResponse.json(
                { error: 'Email atau password salah' },
                { status: 401 }
            )
        }

        const validPassword = await bcrypt.compare(password, user.password)
        console.log('Password valid:', validPassword);
        if (!validPassword) {
            return NextResponse.json(
                { error: 'Email atau password salah' },
                { status: 401 }
            )
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role as Role,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        const response = NextResponse.json(
            {
                message: 'Login berhasil',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name
                }
            },
            { status: 200 }
        )

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400 // 1 day
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}