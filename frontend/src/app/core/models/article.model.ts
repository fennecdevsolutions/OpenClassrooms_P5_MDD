export interface Article {
    id: string;
    title: string;
    createdAt: string;
    authorName: string;
    content: string;
    themeTitle: string;

}

export interface ArticleCreationRequest {
    themeId: string;
    articleTitle: string;
    content: string;
}