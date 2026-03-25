import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { of, throwError } from 'rxjs';
import { getByTestId, getElementByTestId } from '../../../../../../utils/data-testid-helper';
import { ArticleService } from '../../../../core/services/article.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ArticleCreationComponent } from './article-creation.component';

describe('ArticleCreationComponent', () => {
  let component: ArticleCreationComponent;
  let fixture: ComponentFixture<ArticleCreationComponent>;
  let router: Router;

  const mockThemes = [
    { id: '1', title: 'Angular' },
    { id: '2', title: 'Java' }
  ];

  const mockArticleService = {
    createNewArticle: jest.fn(),
  };

  const mockThemeService = {
    getAllThemes: jest.fn().mockReturnValue(of(mockThemes)),
  };

  const mockSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCreationComponent],
      providers: [
        provideRouter([]),
        { provide: ArticleService, useValue: mockArticleService },
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).overrideComponent(ArticleCreationComponent, {
      set: {
        providers: [{ provide: MatSnackBar, useValue: mockSnackBar }]
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleCreationComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a back button with router link and a disabled submit button when form is empty', () => {
    const submitBtn = getElementByTestId(fixture, 'submit-btn');
    const backBtn = getByTestId(fixture, 'back-btn');
    const routerLink = backBtn.injector.get(RouterLink);

    expect(backBtn).toBeTruthy();
    expect((routerLink as any)._urlTree().toString()).toBe('/articles');
    expect(submitBtn.hasAttribute('disabled')).toBe(true);

  });

  it('should create an article and navigate to its details on success', async () => {
    // spy and block the real navigation
    const navigateSpy = jest.spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));;

    const createdArticle = { themeId: '123', articleTitle: 'Nouveau', content: 'Nouveau contenu' };
    mockArticleService.createNewArticle.mockReturnValue(of({ ...createdArticle, id: '16' }));

    component.articleCreateForm.patchValue(createdArticle);

    fixture.detectChanges();

    const submitBtn = getElementByTestId(fixture, 'submit-btn');
    expect(submitBtn.hasAttribute('disabled')).toBe(false);

    const form = getByTestId(fixture, 'article-form');
    form.triggerEventHandler('ngSubmit', null);

    expect(mockArticleService.createNewArticle).toHaveBeenCalledWith(createdArticle);
    expect(navigateSpy).toHaveBeenCalledWith(['/articles', '16']);


  });

  it('should show specific error message on 403 error', async () => {
    mockArticleService.createNewArticle.mockReturnValue(throwError(() => ({ status: 403 })));

    component.articleCreateForm.patchValue({ themeId: '1', articleTitle: 'Test', content: 'Test' });
    component.onSubmit();

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Veuillez vous connecter avant de créer un article',
      'Fermer',
      expect.any(Object)
    );
  });

  it('should show generic error message on other server errors', async () => {
    mockArticleService.createNewArticle.mockReturnValue(throwError(() => ({ status: 500 })));

    component.articleCreateForm.patchValue({ themeId: '1', articleTitle: 'Test', content: 'Test' });
    component.onSubmit();

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Une erreur est survenue',
      'Fermer',
      expect.any(Object)
    );
  });
});
