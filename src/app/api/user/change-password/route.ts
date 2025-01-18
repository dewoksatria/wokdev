// src/app/api/user/change-password/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const { currentPassword, newPassword } = await req.json()

        // Verify token and get user
        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Password saat ini tidak valid' },
                { status: 400 }
            )
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })

        return NextResponse.json(
            { message: 'Password berhasil diubah' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Change password error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}