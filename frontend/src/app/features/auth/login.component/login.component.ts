import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component/header.component';
import { LoginRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login.component',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    HeaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  serverErrorMessage = signal<string | null>(null);
  hidePassword = signal(true);


  loginForm = new FormGroup({
    identifier: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });



  onSubmitForm() {
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest = this.loginForm.getRawValue();
      this.authService.loginUser(loginRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.serverErrorMessage.set(null);
          this.router.navigate(['/']);
        },
        error: (err) => {
          const msg = err.error?.message || "Une erreur est survenue";
          this.serverErrorMessage.set(msg);
        }
      });
    }

  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.preventDefault()
  }
}
