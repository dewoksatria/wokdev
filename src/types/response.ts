// src/types/response.ts
export interface ApiResponse<T> {
    message?: string;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ErrorResponse {
    error: string;
    status?: number;
}

export interface SuccessResponse {
    message: string;
    status?: number;
}