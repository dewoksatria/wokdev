// src/app/api/portfolio/skill/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET all skills
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
        const skills = await prisma.skill.findMany({
            where: { userId: decoded.userId },
            orderBy: [
                { category: 'asc' },
                { name: 'asc' }
            ]
        });

        return NextResponse.json({ skills });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Get skills error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST new skill
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
        const { name, level, category } = await req.json();

        // Validate required fields
        if (!name || !level || !category) {
            return NextResponse.json(
                { error: 'Nama, level, dan kategori skill harus diisi' },
                { status: 400 }
            );
        }

        // Validate level range (1-5)
        if (level < 1 || level > 5) {
            return NextResponse.json(
                { error: 'Level skill harus antara 1-5' },
                { status: 400 }
            );
        }

        const skill = await prisma.skill.create({
            data: {
                name,
                level,
                category,
                userId: decoded.userId
            }
        });

        return NextResponse.json({ skill }, { status: 201 });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Create skill error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT update skill
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
        const { id, name, level, category } = await req.json();

        // Check if skill exists and belongs to user
        const existingSkill = await prisma.skill.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingSkill) {
            return NextResponse.json(
                { error: 'Skill tidak ditemukan' },
                { status: 404 }
            );
        }

        const skill = await prisma.skill.update({
            where: { id },
            data: {
                name,
                level,
                category
            }
        });

        return NextResponse.json({ skill });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Update skill error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE skill
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

        // Check if skill exists and belongs to user
        const existingSkill = await prisma.skill.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingSkill) {
            return NextResponse.json(
                { error: 'Skill tidak ditemukan' },
                { status: 404 }
            );
        }

        await prisma.skill.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Skill berhasil dihapus' },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Delete skill error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}