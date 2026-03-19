import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from '../../../../core/models/article.model';
import { ArticleService } from '../../../../core/services/article.service';

@Component({
  selector: 'app-article',
  imports: [MatCardModule, AsyncPipe, DatePipe, MatIconModule, RouterLink, MatButtonModule],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss',
})
export class ArticleDetailsComponent {
  private articleService = inject(ArticleService);
  private destroyRef = inject(DestroyRef);
  @Input() id!: string;
  article$!: Observable<Article>;


  ngOnInit() {
    this.article$ = this.articleService.getArticleDetails(this.id).pipe(takeUntilDestroyed(this.destroyRef));
  }

}
