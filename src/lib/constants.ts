// src/lib/constants.ts

export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    STAFF: 'STAFF'
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_PERMISSIONS: Record<Role, readonly string[]> = {
    [ROLES.SUPER_ADMIN]: ['GET', 'POST', 'PUT', 'DELETE'],
    [ROLES.ADMIN]: ['GET', 'POST', 'PUT'],
    [ROLES.STAFF]: ['GET']
}