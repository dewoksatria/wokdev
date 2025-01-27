// src/types/portfolio.ts
export interface Experience {
    id: string;
    title: string;
    company: string;
    location?: string | null;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
    description?: string | null;
    image: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    id: string;
    title: string;
    description?: string | null;
    image?: string | null;
    link?: string | null;
    githubUrl?: string | null;
    startDate: Date;
    endDate?: Date | null;
    technologies: string[];
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Skill {
    id: string;
    name: string;
    level: number; // 1-5
    category: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Social {
    id: string;
    platform: string;
    url: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Profile {
    id: string;
    bio?: string | null;
    headline?: string | null;
    location?: string | null;
    website?: string | null;
    avatar?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Form Data interfaces
export interface ExperienceFormData {
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
}

export interface ProjectFormData {
    title: string;
    description?: string;
    image?: string;
    link?: string;
    githubUrl?: string;
    startDate: string;
    endDate?: string;
    technologies: string[];
}

export interface SkillFormData {
    name: string;
    level: number;
    category: string;
}

export interface SocialFormData {
    platform: string;
    url: string;
}

export interface ProfileFormData {
    bio?: string;
    headline?: string;
    location?: string;
    website?: string;
    avatar?: string;
}