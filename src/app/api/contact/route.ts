// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Get client info
        const headersList = await headers(); // Add await here
        const userAgent = headersList.get('user-agent') || 'Unknown';
        const forwarded = headersList.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'Unknown';

        // Create message
        const newMessage = await prisma.message.create({
            data: {
                name,
                email,
                message,
                ipAddress: ip,
                userAgent
            }
        });

        return NextResponse.json(
            { message: 'Message sent successfully', id: newMessage.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}