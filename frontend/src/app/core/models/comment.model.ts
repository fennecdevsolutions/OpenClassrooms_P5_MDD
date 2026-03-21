export interface Comment {
    id: string;
    content: string;
    articleId: string;
    authorUsername: string;
    createdAt: string;
}

export interface CommentPostRequest {
    content: string;
}