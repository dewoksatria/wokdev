// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    // Create response first
    const response = NextResponse.json(
        { message: 'Logged out successfully' },
        { status: 200 }
    )
    
    // Delete the token cookie from the response
    response.cookies.delete('token')

    return response
}