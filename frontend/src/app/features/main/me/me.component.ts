import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { ThemeCardComponent } from '../../../components/card/theme-card/theme-card.component';
import { ThemeWithSubscription } from '../../../core/models/theme.models';
import { UserProfileUpdateRequest } from '../../../core/models/user.model';
import { ThemeService } from '../../../core/services/theme.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-me',
  imports: [ReactiveFormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, ThemeCardComponent, ThemeCardComponent],
  templateUrl: './me.component.html',
  styleUrl: './me.component.scss',
})
export class MeComponent {
  private userService = inject(UserService);
  private themeService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar)
  serverErrorMessage = signal<string | null>(null);
  hidePassword = signal(true);
  isUnsubView = true;

  themes = signal<ThemeWithSubscription[]>([]);

  ngOnInit(): void {
    this.loadThemes();
  }

  loadThemes() {
    this.themeService.getUserSubscriptions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(themes => {
        const mapped = themes.map(theme => ({ ...theme, isSubscribed: true }));
        this.themes.set(mapped);
      });
  }


  profileForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])/)] })
  })

  userProfile$ = this.userService.getUserProfile().pipe(
    takeUntilDestroyed(this.destroyRef),
    tap(user => {
      //pre-fill form
      this.profileForm.patchValue({
        username: user.username,
        email: user.email
      })
    })
  ).subscribe();

  onSubmitForm() {
    if (this.profileForm.valid) {
      const updateRequest: UserProfileUpdateRequest = this.profileForm.getRawValue();
      this.userService.updateUserProfile(updateRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.serverErrorMessage.set(null);
          this.snackBar.open('Profile mis à jour avec succès', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
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

  handleUnsubscribe() {
    this.loadThemes();
  }

}







