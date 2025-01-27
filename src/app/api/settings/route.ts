import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return NextResponse.json({ user });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Get user error:', error);
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
        const { name, email, currentPassword, newPassword } = await req.json();

        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Cek apakah email sudah digunakan
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: {
                        id: decoded.userId
                    }
                }
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                );
            }
        }

        // Jika ada password yang ingin diubah
        if (currentPassword && newPassword) {
            // Validasi password lama
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId }
            });

            if (!user) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 400 }
                );
            }

            // Validasi password baru
            if (newPassword.length < 6) {
                return NextResponse.json(
                    { error: 'New password must be at least 6 characters' },
                    { status: 400 }
                );
            }

            // Hash password baru
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update user dengan password baru
            await prisma.user.update({
                where: { id: decoded.userId },
                data: {
                    password: hashedPassword,
                    ...(name && { name }),
                    ...(email && { email })
                }
            });
        } else {
            // Update user tanpa mengubah password
            await prisma.user.update({
                where: { id: decoded.userId },
                data: {
                    ...(name && { name }),
                    ...(email && { email })
                }
            });
        }

        return NextResponse.json({ message: 'Settings updated successfully' });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        console.error('Update settings error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}