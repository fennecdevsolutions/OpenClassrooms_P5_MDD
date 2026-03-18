import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { Observable } from 'rxjs';
import { ArticleCardComponent } from '../../../components/card/article-card/article-card.component';
import { Article } from '../../../core/models/article.model';
import { ArticleService } from '../../../core/services/article.service';

@Component({
  selector: 'app-article',
  imports: [MatCardModule, MatButtonModule, ArticleCardComponent, AsyncPipe, MatIconModule],
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
    this.articles$ = this.articlService.getAllUserArticles(this.currentDirection);
  }

  toggleSort() {
    this.currentDirection = this.currentDirection === 'desc' ? 'asc' : 'desc';
    this.loadArticles();
  }



}
