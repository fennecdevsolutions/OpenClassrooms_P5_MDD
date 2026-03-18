import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component/login.component';
import { RegisterComponent } from './features/auth/register.component/register.component';
import { HomeComponent } from './features/home/home.component';
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
            { path: 'me', component: MeComponent }
        ]
    },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },

];
