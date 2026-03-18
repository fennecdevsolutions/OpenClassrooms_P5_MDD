import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component/login.component';
import { RegisterComponent } from './features/auth/register.component/register.component';
import { HomeComponent } from './features/home/home.component';
import { ArticleCreationComponent } from './features/main/article/article-creation/article-creation.component';
import { ArticleDetailsComponent } from './features/main/article/article-details/article-details.component';
import { ArticleComponent } from './features/main/article/article.component';
import { MeComponent } from './features/main/me/me.component';
import { ThemeComponent } from './features/main/theme/theme.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent,
        children: [
            { path: '', redirectTo: 'articles', pathMatch: 'full' },
            { path: 'articles', component: ArticleComponent },
            { path: 'themes', component: ThemeComponent },
            { path: 'me', component: MeComponent },
            { path: 'articles/new', component: ArticleCreationComponent },
            { path: 'articles/:id', component: ArticleDetailsComponent }
        ]
    },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },

];
