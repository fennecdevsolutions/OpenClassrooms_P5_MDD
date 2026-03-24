import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { getElementByTestId } from '../../../../../utils/data-testid-helper';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemeCardComponent } from './theme-card.component';

describe('ThemeCardComponent', () => {
  let component: ThemeCardComponent;
  let fixture: ComponentFixture<ThemeCardComponent>;
  const mockThemeService = {
    subscribeTheme: jest.fn(),
    unSubscribeTheme: jest.fn(),
  };

  const mockSnackBar = {
    open: jest.fn(),
  };

  const mockTheme = {
    id: '1',
    title: 'Angular Testing',
    description: 'Learn how to test Angular components like a pro.',
    isSubscribed: false,
  };


  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [ThemeCardComponent],
      providers: [{ provide: ThemeService, useValue: mockThemeService },
      { provide: MatSnackBar, useValue: mockSnackBar }]
    }).overrideComponent(ThemeCardComponent, {
      set: {
        providers: [
          { provide: MatSnackBar, useValue: mockSnackBar }
        ]
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(ThemeCardComponent);
    fixture.componentRef.setInput('theme', mockTheme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the theme title and description', () => {
    const title = getElementByTestId(fixture, 'theme-title');
    const description = getElementByTestId(fixture, 'theme-description');

    expect(title.textContent).toContain(mockTheme.title);
    expect(description.textContent).toContain(mockTheme.description);
  });

  describe('Subscription View (isUnsubView = false)', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('isUnsubView', false);
      fixture.detectChanges();
    });

    it('should show "S\'abonner" when not subscribed', () => {
      component.isSubscribed.set(false);
      fixture.detectChanges();

      const btn = getElementByTestId<HTMLButtonElement>(fixture, 'subscribe-btn');
      expect(btn.textContent).toContain("S'abonner");
      expect(btn.disabled).toBe(false);
    });

    it('should show "Déjà abonné" and be disabled when subscribed', () => {
      component.isSubscribed.set(true);
      fixture.detectChanges();

      const btn = getElementByTestId<HTMLButtonElement>(fixture, 'subscribe-btn');
      expect(btn.textContent).toContain('Déjà abonné');
      expect(btn.disabled).toBe(true);
    });

    it('should call subscribeTheme and show snackbar on success', () => {
      mockThemeService.subscribeTheme.mockReturnValue(of({}));
      const btn = getElementByTestId<HTMLButtonElement>(fixture, 'subscribe-btn');

      btn.click();

      expect(mockThemeService.subscribeTheme).toHaveBeenCalledWith(mockTheme.id);
      expect(component.isSubscribed()).toBe(true);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Abonnement réussi', 'Fermer', expect.any(Object));
    });
  });

  describe('Unsubscription View (isUnsubView = true)', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('isUnsubView', true);
      fixture.detectChanges();
    });

    it('should show "Se désabonner" button', () => {
      const btn = getElementByTestId<HTMLButtonElement>(fixture, 'unsubscribe-btn');

      expect(btn.textContent).toContain('Se désabonner');

    });

    it('should call unSubscribeTheme and emit event on success', () => {
      mockThemeService.unSubscribeTheme.mockReturnValue(of({}));
      const emitSpy = jest.spyOn(component.unsubscribed, 'emit');
      const btn = getElementByTestId<HTMLButtonElement>(fixture, 'unsubscribe-btn');

      btn.click();
      fixture.detectChanges();

      expect(mockThemeService.unSubscribeTheme).toHaveBeenCalledWith(mockTheme.id);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Désabonnement réussi', 'Fermer', expect.any(Object));
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('should handle errors and show appropriate snackbar message', () => {

    it('should handle 409 and show appropriate snackbar message', () => {
      mockThemeService.subscribeTheme.mockReturnValue(throwError(() => ({ status: 409 })));
      fixture.componentRef.setInput('isUnsubView', false);
      fixture.detectChanges();

      getElementByTestId<HTMLButtonElement>(fixture, 'subscribe-btn').click();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Vous êtes déjà abonné à ce thème',
        'Fermer',
        expect.any(Object)
      );
    });

    it('should handle 403 and show appropriate snackbar message', () => {
      mockThemeService.subscribeTheme.mockReturnValue(throwError(() => ({ status: 403 })));
      fixture.componentRef.setInput('isUnsubView', false);
      fixture.detectChanges();

      getElementByTestId<HTMLButtonElement>(fixture, 'subscribe-btn').click();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Veuillez vous connecter avant de vous abonner',
        'Fermer',
        expect.any(Object)
      );
    });

  })

})

