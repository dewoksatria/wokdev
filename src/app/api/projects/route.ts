// src/app/api/project/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const UPLOAD_DIR = join(process.cwd(), 'public/images/projects');

interface BlobPart {
    arrayBuffer(): Promise<ArrayBuffer>;
    size: number;
    name?: string;
}

// GET all projects
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
        const projects = await prisma.project.findMany({
            where: { userId: decoded.userId },
            orderBy: { startDate: 'desc' }
        });

        // Return projects directly without parsing technologies
        return NextResponse.json({ projects });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Get projects error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


// POST new project
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

        // Get form fields
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const link = formData.get('link') as string;
        const githubUrl = formData.get('githubUrl') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const technologies = formData.get('technologies') as string;
        const image = formData.get('image') as unknown as BlobPart | null;

        let imagePath: string | undefined = undefined;

        // Handle image upload
        if (image && 'arrayBuffer' in image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `project-${Date.now()}-${image.name || 'image'}`;
            const filepath = join(UPLOAD_DIR, filename);
            await writeFile(filepath, buffer);
            imagePath = `/images/projects/${filename}`;
        }

        // Create project
        const project = await prisma.project.create({
            data: {
                title,
                description,
                image: imagePath,
                link,
                githubUrl,
                startDate: new Date(startDate),
                endDate: new Date(endDate) ? endDate : '',
                technologies: JSON.stringify(technologies),
                userId: decoded.userId
            }
        });

        // Return with parsed technologies array
        return NextResponse.json({
            project: {
                ...project,
                technologies: JSON.parse(project.technologies)
            }
        }, { status: 201 });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Create project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT update project
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
        const description = formData.get('description') as string;
        const link = formData.get('link') as string;
        const githubUrl = formData.get('githubUrl') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const technologies = formData.get('technologies') as string;
        const image = formData.get('image') as unknown as BlobPart | null;

        // Check if project exists and belongs to user
        const existingProject = await prisma.project.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        let imagePath = existingProject.image;

        // Handle new image upload
        if (image && 'arrayBuffer' in image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `project-${Date.now()}-${image.name || 'image'}`;
            const filepath = join(UPLOAD_DIR, filename);
            await writeFile(filepath, buffer);
            imagePath = `/images/projects/${filename}`;
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                image: imagePath,
                link,
                githubUrl,
                startDate: new Date(startDate),
                endDate: new Date(endDate) ? endDate : '',
                technologies: JSON.stringify(technologies)
            }
        });

        return NextResponse.json({
            project: {
                ...project,
                technologies: JSON.parse(project.technologies)
            }
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Update project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE project
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

        // Check if project exists and belongs to user
        const existingProject = await prisma.project.findFirst({
            where: {
                id,
                userId: decoded.userId
            }
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        await prisma.project.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Project deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Delete project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}