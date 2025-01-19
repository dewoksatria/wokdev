// src/app/api/portfolio/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Ambil user pertama sebagai default untuk halaman portfolio
        const user = await prisma.user.findFirst({
            where: {
                role: 'SUPER_ADMIN' // atau kriteria lain
            },
            select: {
                id: true,
                name: true,
                email: true,
                profile: true,
                experiences: {
                    orderBy: {
                        startDate: 'desc'
                    }
                },
                projects: {
                    orderBy: {
                        startDate: 'desc'
                    }
                },
                skills: {
                    orderBy: {
                        category: 'asc'
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            profile: user.profile,
            experiences: user.experiences,
            projects: user.projects,
            skills: user.skills
        });
    } catch (error) {
        console.error('Get portfolio error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}