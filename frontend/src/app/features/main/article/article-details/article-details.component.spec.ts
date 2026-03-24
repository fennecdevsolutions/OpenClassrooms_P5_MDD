import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ArticleService } from '../../../../core/services/article.service';
import { ArticleDetailsComponent } from './article-details.component';

describe('ArticleDetailsComponent', () => {
  let component: ArticleDetailsComponent;
  let fixture: ComponentFixture<ArticleDetailsComponent>;

  const mockArticleService = {
    getArticleDetails: jest.fn().mockReturnValue(of(null)),
    getArticleComments: jest.fn().mockReturnValue(of([])),
    postCommentOnArticle: jest.fn().mockReturnValue(of({})),
  };

  const mockSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetailsComponent],
      providers: [provideRouter([]),
      { provide: ArticleService, useValue: mockArticleService },
      { provide: MatSnackBar, useValue: mockSnackBar },],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
