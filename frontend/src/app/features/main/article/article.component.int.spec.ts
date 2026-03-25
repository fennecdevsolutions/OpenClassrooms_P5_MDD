import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { getAllByTestId, getElementByTestId } from '../../../../../utils/data-testid-helper';
import { ArticleCardComponent } from '../../../components/card/article-card/article-card.component';
import { ArticleService } from '../../../core/services/article.service';
import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  const mockArticles = [
    { id: '2', title: 'B - Second Article', content: 'Contenu 2', author: 'Dev 2', date: '05/01/2025' },
    { id: '1', title: 'A - Premier Article', content: 'Contenu 1', author: 'Dev 1', date: '01/01/2025' }

  ];

  const mockArticleService = {
    getAllUserArticles: jest.fn().mockReturnValue(of(mockArticles)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        provideRouter([]),
        { provide: ArticleService, useValue: mockArticleService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all articles returned by the service', async () => {
    await fixture.whenStable();
    const cards = getAllByTestId(fixture, "article-card");
    expect(cards.length).toBe(2);

    const firstCard = cards[0].componentInstance as ArticleCardComponent;
    expect(firstCard.article.title).toBe('B - Second Article');
  });

  it('should toggle sort direction render reshly received articles  when clicking sort button', async () => {
    let cards = getAllByTestId(fixture, "article-card");
    expect((cards[0].componentInstance as ArticleCardComponent).article.title).toBe('B - Second Article');

    const sortBtn = getElementByTestId(fixture, 'sort-button');
    let sortedArticles = [mockArticles[1], mockArticles[0]];
    mockArticleService.getAllUserArticles.mockReturnValue(of(sortedArticles));
    sortBtn.click();
    fixture.detectChanges();

    cards = getAllByTestId(fixture, "article-card");
    expect((cards[0].componentInstance as ArticleCardComponent).article.title).toBe('A - Premier Article');
    expect(sortBtn.classList.contains('asc')).toBe(true);
    console.log(sortBtn.classList.toString());


    sortedArticles = mockArticles;
    mockArticleService.getAllUserArticles.mockReturnValue(of(sortedArticles));
    sortBtn.click();
    fixture.detectChanges();

    cards = getAllByTestId(fixture, "article-card");
    expect((cards[0].componentInstance as ArticleCardComponent).article.title).toBe('B - Second Article');
    console.log(sortBtn.classList.toString());
    expect(sortBtn.classList.contains('asc')).toBe(false);
  });

  it('should have correct link on create button', () => {
    const createBtn = getElementByTestId(fixture, 'create-article-btn');
    expect(createBtn.getAttribute('routerLink')).toBe('/articles/new');
  });
});
