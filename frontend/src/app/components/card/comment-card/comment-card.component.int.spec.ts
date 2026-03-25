import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getElementByTestId } from '../../../../../utils/data-testid-helper';
import { Comment } from '../../../core/models/comment.model';
import { CommentCardComponent } from './comment-card.component';

describe('CommentCardComponent', () => {
  let component: CommentCardComponent;
  let fixture: ComponentFixture<CommentCardComponent>;

  const mockComment: Comment = {
    id: '1',
    authorUsername: 'Abdel_Tester',
    content: 'This integration test strategy is very efficient!',
    articleId: '2',
    createdAt: '10/12/2025'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentCardComponent);
    fixture.componentRef.setInput('comment', mockComment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and display author name and content', () => {
    expect(component).toBeTruthy();

    const authorNameEl = getElementByTestId(fixture, 'comment-author');
    expect(authorNameEl.textContent?.trim()).toBe(mockComment.authorUsername);

    const contentEl = getElementByTestId(fixture, 'comment-content');
    expect(contentEl.textContent?.trim()).toBe(mockComment.content);
  });


});
