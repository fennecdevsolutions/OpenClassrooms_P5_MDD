import { Component, Input } from '@angular/core';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-comment-card',
  imports: [],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
})
export class CommentCardComponent {
  @Input({ required: true }) comment!: Comment;


}
