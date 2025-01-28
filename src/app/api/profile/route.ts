import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const UPLOAD_DIR = join(process.cwd(), 'public/uploads');

interface BlobPart {
    arrayBuffer(): Promise<ArrayBuffer>;
    size: number;
    name?: string;
}

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
        const profile = await prisma.profile.findUnique({
            where: { userId: decoded.userId }
        });

        return NextResponse.json({ profile });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Get profile error:', error);
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
        const formData = await req.formData();

        const bio = formData.get('bio') as string;
        const headline = formData.get('headline') as string;
        const location = formData.get('location') as string;
        const website = formData.get('website') as string;
        const avatar = formData.get('avatar') as unknown as BlobPart | null;

        let avatarPath: string | undefined = undefined;

        if (avatar && 'arrayBuffer' in avatar && avatar.size > 0) {
            const buffer = Buffer.from(await avatar.arrayBuffer());
            const filename = `avatar-${decoded.userId}-${Date.now()}-${avatar.name || 'image'}`;
            const filepath = join(UPLOAD_DIR, filename);
            await writeFile(filepath, buffer);
            avatarPath = `/uploads/${filename}`;
        }

        const profile = await prisma.profile.upsert({
            where: { userId: decoded.userId },
            update: {
                bio,
                headline,
                location,
                website,
                ...(avatarPath && { avatar: avatarPath })
            },
            create: {
                userId: decoded.userId,
                bio,
                headline,
                location,
                website,
                avatar: avatarPath
            }
        });

        return NextResponse.json({ profile });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE() {  // Hapus parameter req
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

        await prisma.profile.delete({
            where: { userId: decoded.userId }
        });

        return NextResponse.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Delete profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}