// src/types/auth.ts
import { User } from './user';

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData extends LoginFormData {
    name: string;
}

export interface AuthResponse {
    message: string;
    user: User;
}

export type Role = 'ADMIN' | 'STAFF';

export const ROLES = {
    ADMIN: 'ADMIN' as Role,
    STAFF: 'STAFF' as Role,
} as const;