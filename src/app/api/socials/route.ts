// src/app/api/socials/route.ts
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
        const socials = await prisma.social.findMany({
            where: { userId: decoded.userId },
            orderBy: { platform: 'asc' }
        });

        return NextResponse.json({ socials });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Get socials error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
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
        const { platform, url } = await req.json();

        // Validate required fields
        if (!platform || !url) {
            return NextResponse.json(
                { error: 'Platform and URL are required' },
                { status: 400 }
            );
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            return NextResponse.json(
                { error: 'Invalid URL format ' + e },
                { status: 400 }
            );
        }

        const social = await prisma.social.create({
            data: {
                platform,
                url,
                userId: decoded.userId
            }
        });

        return NextResponse.json({ social }, { status: 201 });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Create social error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
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
        const { id } = await req.json();

        // Check if social exists and belongs to user
        const existingSocial = await prisma.social.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingSocial) {
            return NextResponse.json(
                { error: 'Social media link not found' },
                { status: 404 }
            );
        }

        await prisma.social.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Social media link deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Delete social error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
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
        const { id, platform, url } = await req.json();

        // Check if social exists and belongs to user
        const existingSocial = await prisma.social.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingSocial) {
            return NextResponse.json(
                { error: 'Social media link not found' },
                { status: 404 }
            );
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            return NextResponse.json(
                { error: 'Invalid URL format ' + e },
                { status: 400 }
            );
        }

        const social = await prisma.social.update({
            where: { id },
            data: {
                platform,
                url
            }
        });

        return NextResponse.json({ social });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Update social error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}