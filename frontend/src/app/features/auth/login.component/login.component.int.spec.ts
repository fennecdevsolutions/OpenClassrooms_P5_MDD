import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { getByTestId, getElementByTestId } from '../../../../../utils/data-testid-helper';
import { AuthService } from '../../../core/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  const mockAuthService = {
    loginUser: jest.fn(),
    // isLoggedIn is required by the Header component.
    isLoggedIn: jest.fn().mockReturnValue(false)
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]),
      { provide: AuthService, useValue: mockAuthService }]
    }).compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and initialize the form with empty fields and disabled button', () => {

    expect(component).toBeTruthy();
    expect(component.loginForm.get('identifier')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.valid).toBeFalsy();

    const submitBtn = getElementByTestId<HTMLButtonElement>(fixture, 'submit-btn');
    expect(submitBtn.disabled).toBe(true);
  });

  it('should enable the submit button when the form is valid', () => {
    component.loginForm.setValue({
      identifier: 'testuser',
      password: 'password123'
    });
    fixture.detectChanges();

    const submitBtn = getElementByTestId<HTMLButtonElement>(fixture, 'submit-btn');
    expect(submitBtn.disabled).toBe(false);
  });

  it('should call authService.loginUser and navigate to "/" on success', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    mockAuthService.loginUser.mockReturnValue(of({ token: 'fake-jwt' }));

    component.loginForm.setValue({
      identifier: 'john.dev',
      password: 'securePassword'
    });
    fixture.detectChanges();

    const form = getByTestId(fixture, 'login-form');
    form.triggerEventHandler('ngSubmit', null);

    expect(mockAuthService.loginUser).toHaveBeenCalledWith({
      identifier: 'john.dev',
      password: 'securePassword'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should display a server error message on login failure', () => {
    const errorResponse = { error: { message: 'Identifiants invalides' } };
    mockAuthService.loginUser.mockReturnValue(throwError(() => errorResponse));

    component.loginForm.setValue({
      identifier: 'wrong',
      password: 'wrong'
    });

    component.onSubmitForm();
    fixture.detectChanges();

    const errorEl = getElementByTestId(fixture, 'server-error');
    expect(errorEl.textContent).toContain('Identifiants invalides');
    expect(component.serverErrorMessage()).toBe('Identifiants invalides');
  });

  it('should display default error message on login failure in no message is provided', () => {
    const errorResponse = {};
    mockAuthService.loginUser.mockReturnValue(throwError(() => errorResponse));

    component.loginForm.setValue({
      identifier: 'wrong',
      password: 'wrong'
    });

    component.onSubmitForm();
    fixture.detectChanges();

    const errorEl = getElementByTestId(fixture, 'server-error');
    expect(errorEl.textContent).toContain('Une erreur est survenue');
    expect(component.serverErrorMessage()).toBe('Une erreur est survenue');
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
});
