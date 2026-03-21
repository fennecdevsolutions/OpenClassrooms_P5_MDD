import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Observable, startWith, tap } from 'rxjs';
import { CommentCardComponent } from '../../../../components/card/comment-card/comment-card.component';
import { Article } from '../../../../core/models/article.model';
import { Comment, CommentPostRequest } from '../../../../core/models/comment.model';
import { ArticleService } from '../../../../core/services/article.service';

@Component({
  selector: 'app-article',
  imports: [MatCardModule,
    AsyncPipe,
    DatePipe,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    CommentCardComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss',
})
export class ArticleDetailsComponent {
  articleService = inject(ArticleService);
  snackBar = inject(MatSnackBar);
  destroyRef = inject(DestroyRef);
  @Input() id!: string;
  article$!: Observable<Article>;
  comments$!: Observable<Comment[]>
  cachedComments: Comment[] = [];


  commentForm = new FormGroup({
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });


  ngOnInit() {
    this.article$ = this.articleService.getArticleDetails(this.id).pipe(takeUntilDestroyed(this.destroyRef));
    this.loadComments();
  }
  loadComments() {
    // using cached comments to avoid display of "soyez le premier à commenter" during the new observable fetching
    this.comments$ = this.articleService.getArticleComments(this.id).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(comments => this.cachedComments = comments),
      startWith(this.cachedComments)
    );
  }


  onSubmitForm() {
    if (this.commentForm.valid) {
      const commentPostReq: CommentPostRequest = this.commentForm.getRawValue();
      this.articleService.postCommentOnArticle(this.id, commentPostReq).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
        {
          next: () => {
            this.commentForm.reset();
            this.loadComments();
            this.snackBar.open('Commentaire ajouté', 'Fermer', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          },
          error: (error) => {
            let message = 'Une erreur est survenue'

            if (error.status === 403) {
              message = 'Veuillez vous connecter avant de commenter';
            }
            this.snackBar.open(message, 'Fermer', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            })

          }

        }
      );
    }
  }

}
