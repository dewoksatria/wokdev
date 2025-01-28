// src/app/api/articles/[slug]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const article = await prisma.article.findUnique({
            where: {
                slug: params.slug
            },
            include: {
                user: {
                    select: {
                        name: true,
                        profile: {
                            select: {
                                avatar: true
                            }
                        }
                    }
                }
            }
        });

        if (!article) {
            return NextResponse.json(
                { error: 'Article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ article });
    } catch (error) {
        console.error('Get article error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}