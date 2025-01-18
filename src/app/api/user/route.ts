// src/app/api/user/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ user })
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string }
        const { name } = await req.json()

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: { name },
            select: { id: true, name: true, email: true }
        })

        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string }

        await prisma.user.delete({
            where: { id: decoded.userId }
        })

        // Create new response with cookie deletion
        const response = NextResponse.json(
            { message: 'Account deleted successfully' },
            { status: 200 }
        )

        // Remove the token cookie
        response.cookies.delete('token')

        return response
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}