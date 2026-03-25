import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { getAllByTestId, getByTestId, getElementByTestId } from '../../../../../utils/data-testid-helper';
import { ThemeService } from '../../../core/services/theme.service';
import { UserService } from '../../../core/services/user.service';
import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  const mockUser = { username: 'john.dev', email: 'john@example.com' };
  const mockThemes = [
    { id: '1', title: 'Angular', description: 'Google framework', isSubscribed: true },
    { id: '2', title: 'Java', description: 'Backend language', isSubscribed: true }
  ];

  const mockUserService = {
    getUserProfile: jest.fn().mockReturnValue(of(mockUser)),
    updateUserProfile: jest.fn(),
  };

  const mockThemeService = {
    getUserSubscriptions: jest.fn().mockReturnValue(of(mockThemes)),
  };

  const mockSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [MeComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ]
    }).overrideComponent(MeComponent, ({
      set: {
        providers: [{ provide: MatSnackBar, useValue: mockSnackBar }]
      }
    }))
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and load user profile and pre-fill the form', () => {
    expect(component).toBeTruthy();

    expect(mockUserService.getUserProfile).toHaveBeenCalled();
    expect(component.profileForm.get('username')?.value).toBe(mockUser.username);
    expect(component.profileForm.get('email')?.value).toBe(mockUser.email);
    expect(component.profileForm.get('password')?.value).toBe("");
  });

  it('should render the list of subscribed themes', () => {
    const themeCards = getAllByTestId(fixture, "subscribed-theme-card");
    expect(themeCards.length).toBe(2);
  });

  it('should call updateUserProfile and show snackbar on success', () => {
    mockUserService.updateUserProfile.mockReturnValue(of({}));

    component.profileForm.patchValue({ username: 'new.name' });
    fixture.detectChanges();

    const form = getByTestId(fixture, 'profile-form');
    form.triggerEventHandler('ngSubmit', null);

    expect(mockUserService.updateUserProfile).toHaveBeenCalledWith(expect.objectContaining({
      username: 'new.name',
      email: 'john@example.com'
    }));

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Profile mis à jour avec succès',
      'Fermer',
      expect.any(Object)
    );
  });

  it('should display server error message when update fails', () => {
    mockUserService.updateUserProfile.mockReturnValue(throwError(() => ({
      error: { message: 'Erreur lors de la mise à jour' }
    })));

    component.onSubmitForm();
    fixture.detectChanges();

    const errorEl = getElementByTestId(fixture, 'server-error');
    expect(errorEl.textContent).toContain('Erreur lors de la mise à jour');
  });

  it('should display default error message when update and server reply does not contain error', () => {
    mockUserService.updateUserProfile.mockReturnValue(throwError(() => ({})));

    component.onSubmitForm();
    fixture.detectChanges();

    const errorEl = getElementByTestId(fixture, 'server-error');
    expect(errorEl.textContent).toContain('Une erreur est survenue');
  });

  it('should disable submit button if email is invalid', () => {
    const emailControl = component.profileForm.get('email');
    emailControl?.setValue('not-an-email');
    fixture.detectChanges();

    const submitBtn = getElementByTestId<HTMLButtonElement>(fixture, 'submit-btn');
    expect(submitBtn.disabled).toBe(true);
  });

  it('should toggle password visibility when icon is clicked', () => {
    const passwordInput = getElementByTestId<HTMLInputElement>(fixture, 'password-input');
    const toggleBtn = getElementByTestId<HTMLButtonElement>(fixture, 'toggle-password-btn');
    const toggleSpy = jest.spyOn(component, 'togglePasswordVisibility');

    expect(passwordInput.type).toBe('password');

    toggleBtn.click();
    fixture.detectChanges();

    expect(passwordInput.type).toBe('text');
    expect(component.hidePassword()).toBe(false);
    expect(toggleSpy).toHaveBeenCalledTimes(1);
  });

  it('should refresh the list on unsubscribe from theme card', () => {
    const themeCards = getAllByTestId(fixture, "subscribed-theme-card");
    expect(themeCards.length).toBe(2);

    const updatedThemes = [mockThemes[1]];
    mockThemeService.getUserSubscriptions.mockReturnValue(of(updatedThemes));

    component.handleUnsubscribe();
    fixture.detectChanges();

    expect(mockThemeService.getUserSubscriptions).toHaveBeenCalledTimes(2);
    const updatedCards = getAllByTestId(fixture, "subscribed-theme-card");
    expect(updatedCards.length).toBe(1);

  })


});
