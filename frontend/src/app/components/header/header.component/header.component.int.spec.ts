import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { getByTestId, getElementByTestId } from '../../../../../utils/data-testid-helper';
import { AuthService } from '../../../core/services/auth.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent Integration Test', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const mockIsLoggedIn = signal<string | null>(null);

  const mockAuthService = {
    isLoggedIn: mockIsLoggedIn,
    logout: jest.fn(),
  };


  beforeEach(async () => {
    mockIsLoggedIn.set(null);
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([]),
      { provide: AuthService, useValue: mockAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Logged Out State', () => {
    it('should not show navigation links or logout button', () => {
      mockIsLoggedIn.set(null);
      fixture.detectChanges();

      const logoutBtn = getByTestId(fixture, 'logout-button');
      const articleLink = getByTestId(fixture, 'nav-articles');
      const themeLink = getByTestId(fixture, 'nav-themes');
      const profileLink = getByTestId(fixture, 'nav-profile');

      expect(logoutBtn).toBeFalsy();
      expect(articleLink).toBeFalsy();
      expect(themeLink).toBeFalsy();
      expect(profileLink).toBeFalsy();
    });

    it('should apply the is-guest class to the toolbar', () => {
      mockIsLoggedIn.set(null);
      fixture.detectChanges();

      const toolbar = fixture.debugElement.query(By.css('mat-toolbar'));
      expect(toolbar.nativeElement.classList).toContain('is-guest');
    });
  });

  describe('Logged In State', () => {
    beforeEach(() => {
      mockIsLoggedIn.set('valid-token');
      fixture.detectChanges();
    });

    it('should display all navigation links and profile icon', () => {
      expect(getByTestId(fixture, 'nav-articles')).toBeTruthy();
      expect(getByTestId(fixture, 'nav-themes')).toBeTruthy();
      expect(getByTestId(fixture, 'nav-profile')).toBeTruthy();
      expect(getByTestId(fixture, 'logout-button')).toBeTruthy();
    });

    it('should not have the is-guest class on the toolbar', () => {
      const toolbar = fixture.debugElement.query(By.css('mat-toolbar'));
      expect(toolbar.nativeElement.classList).not.toContain('is-guest');
    });

    it('should call authService.logout() when the logout button is clicked', () => {
      const logoutBtn = getElementByTestId<HTMLButtonElement>(fixture, 'logout-button');

      logoutBtn.click();

      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should emit toggleSidenav when the mobile menu button is clicked', () => {

      jest.spyOn(component.toggleSidenav, 'emit');

      const menuBtn = getElementByTestId<HTMLButtonElement>(fixture, 'menu-button');
      menuBtn.click();

      expect(component.toggleSidenav.emit).toHaveBeenCalled();
    });
  });


});
