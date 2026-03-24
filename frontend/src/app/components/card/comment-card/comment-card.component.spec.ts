import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCardComponent } from './comment-card.component';

describe('CommentCardComponent', () => {
  let component: CommentCardComponent;
  let fixture: ComponentFixture<CommentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentCardComponent);
    fixture.componentRef.setInput('comment', {
      id: '1',
      authorUsername: 'testUser',
      content: 'Test comment',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
