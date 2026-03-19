import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from "@angular/router";
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-article-card',
  imports: [MatCardModule, DatePipe, RouterLink],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent {
  @Input({ required: true }) article!: Article;
}
