// src/app/api/portfolio/article/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const UPLOAD_DIR = join(process.cwd(), 'public/uploads');

// Helper to generate slug
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
}

// GET all articles or single article
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const article = await prisma.article.findUnique({
                where: { slug },
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
            return NextResponse.json({ article });
        }

        const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
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

        return NextResponse.json({ articles });
    } catch (error) {
        console.error('Get articles error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST new article
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
        const formData = await req.formData();

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const excerpt = formData.get('excerpt') as string;
        const published = formData.get('published') === 'true';
        const coverImage = formData.get('coverImage') as unknown as Blob | null;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        let coverImagePath: string | undefined = undefined;

        if (coverImage && coverImage.size > 0) {
            const buffer = Buffer.from(await coverImage.arrayBuffer());
            const filename = `article-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const filepath = join(UPLOAD_DIR, filename);
            await writeFile(filepath, buffer);
            coverImagePath = `/uploads/${filename}`;
        }

        const slug = generateSlug(title);

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                coverImage: coverImagePath,
                published,
                publishedAt: published ? new Date() : null,
                userId: decoded.userId
            }
        });

        return NextResponse.json({ article }, { status: 201 });
    } catch (error) {
        console.error('Create article error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT update article
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
        const formData = await req.formData();

        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const excerpt = formData.get('excerpt') as string;
        const published = formData.get('published') === 'true';
        const coverImage = formData.get('coverImage') as unknown as Blob | null;

        // Check if article exists and belongs to user
        const existingArticle = await prisma.article.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingArticle) {
            return NextResponse.json(
                { error: 'Article not found' },
                { status: 404 }
            );
        }

        let coverImagePath = existingArticle.coverImage;

        if (coverImage && coverImage.size > 0) {
            const buffer = Buffer.from(await coverImage.arrayBuffer());
            const filename = `article-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const filepath = join(UPLOAD_DIR, filename);
            await writeFile(filepath, buffer);
            coverImagePath = `/uploads/${filename}`;
        }

        const updatedArticle = await prisma.article.update({
            where: { id },
            data: {
                title,
                content,
                excerpt,
                coverImage: coverImagePath,
                published,
                publishedAt: published && !existingArticle.publishedAt ? new Date() : existingArticle.publishedAt
            }
        });

        return NextResponse.json({ article: updatedArticle });
    } catch (error) {
        console.error('Update article error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE article
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

        // Check if article exists and belongs to user
        const existingArticle = await prisma.article.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingArticle) {
            return NextResponse.json(
                { error: 'Article not found' },
                { status: 404 }
            );
        }

        await prisma.article.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Article deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete article error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}