import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MainComponent } from '../main/main.component/main.component';
import { LandingComponent } from './landing.component/landing.component';

@Component({
  selector: 'app-home',
  imports: [LandingComponent, MainComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected authService = inject(AuthService);
}
