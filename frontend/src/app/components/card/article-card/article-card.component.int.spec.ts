import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { getElementByTestId } from '../../../../../utils/data-testid-helper';
import { Article } from '../../../core/models/article.model';
import { ArticleCardComponent } from './article-card.component';

describe('ArticleCardComponent', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;

  const mockArticle: Article = {
    id: '42',
    title: 'Testing Angular Components',
    content: 'This is a detailed guide on integration testing...',
    authorName: 'Abdel_Dev',
    createdAt: '2024-03-24T10:00:00Z',
    themeTitle: 'Angular',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCardComponent);
    fixture.componentRef.setInput('article', mockArticle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the article title and metadata', () => {
    const title = getElementByTestId(fixture, 'article-title');
    const author = getElementByTestId(fixture, 'article-author');
    const date = getElementByTestId(fixture, 'article-date');

    expect(title.textContent).toContain(mockArticle.title);
    expect(author.textContent).toContain(mockArticle.authorName);
    expect(date.textContent).toContain('24/03/2024');
  });

  it('should display the truncated content snippet', () => {

    const content = getElementByTestId(fixture, 'article-content');
    expect(content.textContent).toContain(mockArticle.content);
  });

  it('should have the correct routerLink for the article details', async () => {
    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();
    await fixture.whenStable();
    const linkDe = fixture.debugElement.query(By.directive(RouterLink));
    expect(linkDe).not.toBeNull();

    const routerLink = linkDe.injector.get(RouterLink);

    expect((routerLink as any)._urlTree().toString()).toBe('/articles/42');
  })
});
