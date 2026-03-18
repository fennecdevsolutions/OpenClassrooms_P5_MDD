import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-article-card',
  imports: [MatCardModule, DatePipe],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent {
  @Input({ required: true }) article!: Article;
}
