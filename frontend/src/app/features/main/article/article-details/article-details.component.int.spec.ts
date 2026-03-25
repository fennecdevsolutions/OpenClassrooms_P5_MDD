import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { getAllByTestId, getByTestId, getElementByTestId } from '../../../../../../utils/data-testid-helper';
import { ArticleService } from '../../../../core/services/article.service';
import { ArticleDetailsComponent } from './article-details.component';

describe('ArticleDetailsComponent', () => {
  let component: ArticleDetailsComponent;
  let fixture: ComponentFixture<ArticleDetailsComponent>;

  const mockArticle = {
    id: '1',
    title: 'Titre de test',
    content: 'Contenu détaillé',
    authorName: 'Jean De',
    themeTitle: 'Angular',
    createdAt: new Date(2012, 11, 12)
  };

  const mockComments = [
    { id: '12', authorName: 'Alice', content: 'Super article !' }
  ];

  const mockArticleService = {
    getArticleDetails: jest.fn().mockReturnValue(of(mockArticle)),
    getArticleComments: jest.fn().mockReturnValue(of(mockComments)),
    postCommentOnArticle: jest.fn().mockReturnValue(of({})),
  };

  const mockSnackBar = { open: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [ArticleDetailsComponent],
      providers: [provideRouter([]),
      { provide: ArticleService, useValue: mockArticleService },
      { provide: MatSnackBar, useValue: mockSnackBar }]
    }).overrideComponent(ArticleDetailsComponent, {
      set: {
        providers: [{ provide: MatSnackBar, useValue: mockSnackBar }]
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 1);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should display article details and comments on load', async () => {

    const titleEl = getElementByTestId(fixture, 'article-title');
    const dateEl = getElementByTestId(fixture, 'article-date');
    const authorEl = getElementByTestId(fixture, 'article-author');
    const contentEl = getElementByTestId(fixture, 'article-content');
    const themeEl = getElementByTestId(fixture, 'article-theme');
    expect(titleEl.textContent).toContain(mockArticle.title);
    expect(dateEl.textContent.trim()).toContain('12/12/2012');
    expect(authorEl.textContent).toContain(mockArticle.authorName);
    expect(contentEl.textContent).toContain(mockArticle.content);
    expect(themeEl.textContent).toContain(mockArticle.themeTitle);

    const commentCards = getAllByTestId(fixture, 'comment-card');
    expect(commentCards.length).toBe(1);
  });

  it('should post a comment and refresh the list', async () => {
    const newComment = { id: '102', authorName: 'Moi', content: 'Nouveau commentaire' };
    mockArticleService.getArticleComments.mockReturnValue(of([...mockComments, newComment]));

    component.commentForm.controls['content'].setValue('Nouveau commentaire');
    fixture.detectChanges();

    const form = getByTestId(fixture, 'comment-form');
    form.triggerEventHandler('ngSubmit', null);

    fixture.detectChanges();

    expect(mockArticleService.postCommentOnArticle).toHaveBeenCalledWith(1, { content: 'Nouveau commentaire' });
    expect(mockSnackBar.open).toHaveBeenCalledWith('Commentaire ajouté', 'Fermer', expect.any(Object));


    const commentCards = getAllByTestId(fixture, "comment-card");
    expect(commentCards.length).toBe(2);
    expect(component.commentForm.get('content')?.value).toBe("");
  });

  it('should show specific error message on 403 error', async () => {
    const errorResponse = { status: 403 };
    mockArticleService.postCommentOnArticle.mockReturnValue(throwError(() => errorResponse));

    component.commentForm.controls['content'].setValue('Commentaire interdit');
    const form = getByTestId(fixture, 'comment-form');
    form.triggerEventHandler('ngSubmit', null);

    fixture.detectChanges();

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Veuillez vous connecter avant de commenter',
      'Fermer',
      expect.any(Object)
    );
  });

  it('should show generic error message on other errors', async () => {
    const errorResponse = { status: 500 };
    mockArticleService.postCommentOnArticle.mockReturnValue(throwError(() => errorResponse));

    component.commentForm.controls['content'].setValue('Erreur serveur');
    const form = getByTestId(fixture, 'comment-form');
    form.triggerEventHandler('ngSubmit', null);

    fixture.detectChanges();

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Une erreur est survenue',
      'Fermer',
      expect.any(Object)
    );
  });


});
