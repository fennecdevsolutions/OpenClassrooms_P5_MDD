import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { ThemeCardComponent } from '../../../components/card/theme-card/theme-card.component';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme',
  imports: [AsyncPipe, ThemeCardComponent],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeComponent {
  private themeService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  allThemes$ = this.themeService.getAllThemes();
  subscribedThemes$ = this.themeService.getUserSubscriptions();

  // add subscription state to themes before injecting them into the cards
  themes$ = combineLatest([this.allThemes$, this.subscribedThemes$]).pipe(
    takeUntilDestroyed(this.destroyRef),
    map(
      ([allThemes, subscribedThemes]) => {
        const subscribedThemesIds = new Set(subscribedThemes.map(s => s.id))
        return allThemes.map(theme => ({
          ...theme,
          isSubscribed: subscribedThemesIds.has(theme.id)
        }))
      }
    )
  )
}

