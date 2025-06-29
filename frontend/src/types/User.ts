// File: src/types/User.ts

export interface User {
 id: string;
 email: string;
 firstName: string;
 lastName: string;
 role: string;
 createdAt: string;
}

export interface AuthState {
 user: User | null;
 token: string | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 error: string | null;
}

export interface LoginCredentials {
 email: string;
 password: string;
}

export interface LoginResponse {
 user: User;
 token: string;
}
