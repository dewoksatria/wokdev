// src/app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };

        // Get user role
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Not authorized' },
                { status: 403 }
            );
        }

        const messages = await prisma.message.findMany({
            orderBy: [
                { status: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Get messages error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
