// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { ROLE_PERMISSIONS, Role, ROLES } from '@/lib/constants'

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/auth/login', '/auth/register', '/api/auth/login', '/api/auth/register', '/api/portfolio']

// Define JWT payload interface
interface JWTPayload {
    userId: string
    email: string
    role: Role
    iat: number
    exp: number
}

function isValidRole(role: string): role is Role {
    return Object.values(ROLES).includes(role as Role)
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Allow public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next()
    }

    // Check for token
    const token = request.cookies.get('token')

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        // Verify token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
        const { payload } = await jwtVerify(token.value, secret)
        const decodedPayload = payload as unknown as JWTPayload

        // Check role-based access for API routes
        if (pathname.startsWith('/api/')) {
            const userRole = decodedPayload.role

            if (!isValidRole(userRole)) {
                return NextResponse.json(
                    { error: 'Invalid role' },
                    { status: 403 }
                )
            }

            const allowedMethods = ROLE_PERMISSIONS[userRole]

            if (!allowedMethods.includes(request.method)) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 403 }
                )
            }
        }

        // Add user info to headers for backend routes
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', decodedPayload.userId)
        requestHeaders.set('x-user-role', decodedPayload.role)

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    } catch (error) {
        console.log(error)
        // Token is invalid
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}