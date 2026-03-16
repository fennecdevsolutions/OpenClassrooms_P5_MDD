import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component/header.component';
import { MainComponent } from '../main/main.component/main.component';
import { LandingComponent } from './landing.component/landing.component';

@Component({
  selector: 'app-home',
  imports: [LandingComponent, MainComponent, HeaderComponent, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
  }
}
