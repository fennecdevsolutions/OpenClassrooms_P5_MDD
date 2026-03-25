import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { getByTestId, getElementByTestId } from '../../../../../utils/data-testid-helper';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  const mockAuthService = {
    registerUser: jest.fn().mockReturnValue(of({})),
    // isLoggedIn is required by the Header component.
    isLoggedIn: jest.fn().mockReturnValue(false)
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([]),
      { provide: AuthService, useValue: mockAuthService }]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  describe('Initialisation and happy path', () => {
    it('should initialize with empty form and disabled submit button', () => {
      expect(component).toBeTruthy();
      expect(component.registerForm.valid).toBeFalsy();
      expect(component.registerForm.get('username')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
      const submitBtn = getElementByTestId<HTMLButtonElement>(fixture, 'submit-btn');
      expect(submitBtn.disabled).toBe(true);
    });

    it('should call registerUser and navigate on success', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      mockAuthService.registerUser.mockReturnValue(of({ token: 'new-user-token' }));

      component.registerForm.setValue({
        username: 'newuser',
        email: 'test@test.com',
        password: 'Password123!'
      });
      fixture.detectChanges();

      const form = getByTestId(fixture, 'register-form');
      form.triggerEventHandler('ngSubmit', null);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'test@test.com',
        password: 'Password123!'
      });
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });


  })



  describe('Form Validation and password visibility', () => {
    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('valid@example.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should validate password complexity', () => {
      const passwordControl = component.registerForm.get('password');

      // Too short
      passwordControl?.setValue('Ab1$');
      expect(passwordControl?.valid).toBeFalsy();

      // No special character
      passwordControl?.setValue('Password123');
      expect(passwordControl?.valid).toBeFalsy();

      // Valid: Min 8, Upper, Lower, Number, Special
      passwordControl?.setValue('Password123!');
      expect(passwordControl?.valid).toBe(true);
    });

    it('should toggle password visibility', () => {
      const passwordInput = getElementByTestId<HTMLInputElement>(fixture, 'password-input');
      const toggleBtn = getElementByTestId<HTMLButtonElement>(fixture, 'toggle-password-btn');

      expect(passwordInput.type).toBe('password');
      expect(component.hidePassword()).toBe(true);

      toggleBtn.click();
      fixture.detectChanges();

      expect(passwordInput.type).toBe('text');
      expect(component.hidePassword()).toBe(false);
    });

  })


  describe('Error management', () => {

    it('should display error message when registration fails', () => {
      const errorResponse = { error: { message: 'Cet email est déjà utilisé' } };
      mockAuthService.registerUser.mockReturnValue(throwError(() => errorResponse));

      component.registerForm.setValue({
        username: 'existing',
        email: 'taken@test.com',
        password: 'Password123!'
      });

      component.onSubmitForm();
      fixture.detectChanges();

      const errorEl = getElementByTestId(fixture, 'server-error');
      expect(errorEl.textContent).toContain('Cet email est déjà utilisé');
    });

    it('should display default error message when response do not contain an error', () => {
      const errorResponse = {};
      mockAuthService.registerUser.mockReturnValue(throwError(() => errorResponse));

      component.registerForm.setValue({
        username: 'existing',
        email: 'taken@test.com',
        password: 'Password123!'
      });

      component.onSubmitForm();
      fixture.detectChanges();

      const errorEl = getElementByTestId(fixture, 'server-error');
      expect(errorEl.textContent).toContain('Une erreur est survenue');
    });
  })
})
