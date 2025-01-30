
// src/app/api/messages/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface RouteParams {
    params: { id: string }
}

export async function PATCH(req: Request, { params }: RouteParams) {
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

        const { status } = await req.json();
        const { id } = params;

        const updatedMessage = await prisma.message.update({
            where: { id },
            data: {
                status,
                readAt: status === 'READ' ? new Date() : undefined
            }
        });

        return NextResponse.json({ message: updatedMessage });
    } catch (error) {
        console.error('Update message error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}