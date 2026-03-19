import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleCardComponent } from '../../../components/card/article-card/article-card.component';
import { Article } from '../../../core/models/article.model';
import { ArticleService } from '../../../core/services/article.service';

@Component({
  selector: 'app-article',
  imports: [MatCardModule, MatButtonModule, ArticleCardComponent, AsyncPipe, MatIconModule, RouterLink],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {

  private articlService = inject(ArticleService);
  currentDirection: 'asc' | 'desc' = 'desc';
  articles$!: Observable<Article[]>

  ngOnInit(): void {
    this.loadArticles();
  }
  private loadArticles() {
    this.articles$ = this.articlService.getAllUserArticles(this.currentDirection).pipe(
    );
  }

  toggleSort() {
    this.currentDirection = this.currentDirection === 'desc' ? 'asc' : 'desc';
    this.loadArticles();
  }



}
