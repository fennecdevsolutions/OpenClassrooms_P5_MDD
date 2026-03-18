import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article, ArticleCreationRequest } from '../models/article.model';

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
}
