import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component/header.component';
import { AuthService } from '../../core/services/auth.service';
import { LandingComponent } from './landing.component/landing.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, LandingComponent, RouterOutlet, HeaderComponent, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
  }
}
