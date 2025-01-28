// src/app/api/experience/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET all experiences
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
        const experiences = await prisma.experience.findMany({
            where: { userId: decoded.userId },
            orderBy: { startDate: 'desc' }
        });

        return NextResponse.json({ experiences });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Get experiences error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST new experience
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
        const { title, company, location, startDate, endDate, current, description } = await req.json();

        // Validate required fields
        if (!title || !company || !startDate) {
            return NextResponse.json(
                { error: 'Title, company, and start date are required' },
                { status: 400 }
            );
        }

        const experience = await prisma.experience.create({
            data: {
                title,
                company,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                current,
                description,
                userId: decoded.userId
            }
        });

        return NextResponse.json({ experience }, { status: 201 });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Create experience error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT update experience
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
        const { id, title, company, location, startDate, endDate, current, description } = await req.json();

        // Check if experience exists and belongs to user
        const existingExperience = await prisma.experience.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingExperience) {
            return NextResponse.json(
                { error: 'Experience not found' },
                { status: 404 }
            );
        }

        const experience = await prisma.experience.update({
            where: { id },
            data: {
                title,
                company,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                current,
                description
            }
        });

        return NextResponse.json({ experience });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Update experience error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE experience
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

        // Check if experience exists and belongs to user
        const existingExperience = await prisma.experience.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingExperience) {
            return NextResponse.json(
                { error: 'Experience not found' },
                { status: 404 }
            );
        }

        await prisma.experience.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Experience deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Delete experience error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}