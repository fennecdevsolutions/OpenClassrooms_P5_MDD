export interface User {
    username: string;
    email: string;
}

export interface UserProfileUpdateRequest {
    username: string;
    email: string;
    password: string | null;
}