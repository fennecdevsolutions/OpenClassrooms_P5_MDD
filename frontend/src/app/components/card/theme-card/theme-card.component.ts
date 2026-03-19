import { Component, DestroyRef, inject, Input, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeWithSubscription } from '../../../core/models/theme.models';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-card',
  imports: [MatCardModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './theme-card.component.html',
  styleUrl: './theme-card.component.scss',
})
export class ThemeCardComponent {
  theme = input.required<ThemeWithSubscription>();
  isSubscribed = signal(false);
  @Input() isUnsubView: boolean = false;
  unsubscribed = output<void>();
  private themeService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.isSubscribed.set(this.theme().isSubscribed);
  }
  onUnsubscribe(themeId: string) {
    this.themeService.unSubscribeTheme(themeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.snackBar.open('Désabonnement réussi', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        // emit output to refresh the mother component (me component)
        this.unsubscribed.emit();
      },
      error: (error) => {
        let message = 'Une erreur est survenue'

        if (error.status === 409) {
          message = 'Vous êtes déjà abonné à ce thème';
        } else if (error.status === 403) {
          message = 'Veuillez vous connecter avant de vous abonner'
        }
        this.snackBar.open(message, 'Fermer', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })

      }
    })
  }

  onSubscribe(themeId: string) {
    this.themeService.subscribeTheme(themeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isSubscribed.set(true);
        this.snackBar.open('Abonnement réussi', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      },
      error: (error) => {
        let message = 'Une erreur est survenue'

        if (error.status === 409) {
          message = 'Vous êtes déjà abonné à ce thème';
        } else if (error.status === 403) {
          message = 'Veuillez vous connecter avant de vous abonner'
        }
        this.snackBar.open(message, 'Fermer', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })

      }
    })
  }
}
