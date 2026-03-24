import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ArticleService } from '../../../../core/services/article.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ArticleCreationComponent } from './article-creation.component';

describe('ArticleCreationComponent', () => {
  let component: ArticleCreationComponent;
  let fixture: ComponentFixture<ArticleCreationComponent>;

  const mockArticleService = {
    createNewArticle: jest.fn().mockReturnValue(of({})),
  };

  const mockThemeService = {
    getAllThemes: jest.fn().mockReturnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCreationComponent],
      providers: [
        provideRouter([]),
        { provide: ArticleService, useValue: mockArticleService },
        { provide: ThemeService, useValue: mockThemeService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCreationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
