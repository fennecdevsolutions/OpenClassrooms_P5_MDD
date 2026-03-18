import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { Article, ArticleCreationRequest } from '../../../../core/models/article.model';
import { ArticleService } from '../../../../core/services/article.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-article-creation',
  imports: [MatListModule, AsyncPipe, MatIconModule, ReactiveFormsModule, MatButtonModule, RouterLink, MatFormField, MatLabel, MatSelectModule, MatInput],
  templateUrl: './article-creation.component.html',
  styleUrl: './article-creation.component.scss',
})
export class ArticleCreationComponent {
  private articleService = inject(ArticleService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  themes$ = this.themeService.getAllThemes();

  articleCreateForm = new FormGroup({
    themeId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    articleTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  })

  onSubmit() {
    if (this.articleCreateForm.valid) {
      const creationRequest: ArticleCreationRequest = this.articleCreateForm.getRawValue();
      this.articleService.createNewArticle(creationRequest).subscribe(
        {
          next: (newArticle: Article) => {
            this.router.navigate(['/articles', newArticle.id]);
          },
          error: (error) => console.error('Error creating article', error)
        }
      );
    }

  }


}
