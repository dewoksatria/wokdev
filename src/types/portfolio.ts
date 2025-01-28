// src/types/portfolio.ts
import { User } from "./user";
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
    technologies: string;
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
    image: File | null;
    link?: string;
    githubUrl?: string;
    startDate: string;
    endDate: string;
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

export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    published: boolean;
    publishedAt: Date | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        name: string | null;
        profile?: {
            avatar: string | null;
        } | null;
    } | null;
}

export interface ArticleFormData {
    title: string;
    content: string;
    excerpt?: string;
    coverImage: File | null;
    published: boolean;
}

// Response types
export interface ArticleResponse {
    article: Article;
}

export interface ArticlesResponse {
    articles: Article[];
}


export interface PortfolioData {
    user: User;
    profile: Profile | null;
    experiences: Experience[];
    projects: Project[];
    skills: Skill[];
    socials?: Social[]; // Tambahkan ini
    articles?: Article[];
}