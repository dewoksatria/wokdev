// src/types/user.ts
import { Role } from './auth';
import {Experience, Project, Skill, Social, Profile} from './portfolio';

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    experiences?: Experience[];
    projects?: Project[];
    skills?: Skill[];
    socials?: Social[];
    profile?: Profile | null;
}

export interface UserUpdateData {
    name?: string;
    email?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}