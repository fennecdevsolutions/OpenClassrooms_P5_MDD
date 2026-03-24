import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Article, ArticleCreationRequest } from '../models/article.model';
import { Comment } from '../models/comment.model';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/articles';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArticleService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createNewArticle', () => {

    it('should create a new article', () => {
      const mockArticleCreationReq: ArticleCreationRequest = { themeId: '1', articleTitle: 'New Article', content: 'New article content' };
      const mockArticle: Partial<Article> = { id: '1', title: 'New Article', content: 'New article content' };

      service.createNewArticle(mockArticleCreationReq).subscribe(article => {
        expect(article.title).toBe('New Article');
      })
      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockArticle);
    })

  })

  describe('getAllUserArticles', () => {
    it('should fetch articles with default "desc" direction', () => {
      const mockArticles: Partial<Article>[] = [{ id: '1', title: 'Test Article', content: 'Unitary test created article' }];

      service.getAllUserArticles().subscribe(articles => {
        expect(articles.length).toBe(1);
        expect(articles[0].title).toBe('Test Article');
      });

      const req = httpMock.expectOne(request =>
        request.url === apiUrl && request.params.get('direction') === 'desc'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockArticles);
    });

    it('should fetch articles with custom "asc" direction', () => {
      service.getAllUserArticles('asc').subscribe();

      const req = httpMock.expectOne(request =>
        request.params.get('direction') === 'asc'
      );

      req.flush([]);

    });
  });

  describe('Article Details & Comments', () => {
    const articleId = '42';

    it('should get article details by id', () => {
      service.getArticleDetails(articleId).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/${articleId}`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should get article comments', () => {
      const mockComments: Partial<Comment>[] = [{ id: '1', content: 'Nice!' }];

      service.getArticleComments(articleId).subscribe(comments => {
        expect(comments[0].content).toBe('Nice!');
      });

      const req = httpMock.expectOne(`${apiUrl}/${articleId}/comments`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComments);
    });

    it('should post a new comment', () => {
      const commentReq = { content: 'New Comment' };

      service.postCommentOnArticle(articleId, commentReq).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/${articleId}/comments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(commentReq);
      req.flush({});
    });
  });



});
