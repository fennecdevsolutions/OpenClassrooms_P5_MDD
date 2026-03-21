import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article, ArticleCreationRequest } from '../models/article.model';
import { Comment, CommentPostRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {

  private httpClient = inject(HttpClient);
  private apiUrl = '/api/articles'


  getAllUserArticles(direction: string = 'desc'): Observable<Article[]> {
    const params = new HttpParams().set('direction', direction);
    return this.httpClient.get<Article[]>(this.apiUrl, { params });
  }

  createNewArticle(articleReq: ArticleCreationRequest): Observable<Article> {
    return this.httpClient.post<Article>(this.apiUrl, articleReq);
  }

  getArticleDetails(id: string): Observable<Article> {
    return this.httpClient.get<Article>(`${this.apiUrl}/${id}`);
  }

  getArticleComments(id: string): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.apiUrl}/${id}/comments`);
  }

  postCommentOnArticle(id: string, commentPostReq: CommentPostRequest): Observable<Comment> {
    return this.httpClient.post<Comment>(`${this.apiUrl}/${id}/comments`, commentPostReq);
  }
}
