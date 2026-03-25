import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { provideRouter } from '@angular/router';
import { getByTestId, getElementByTestId } from '../../../../utils/data-testid-helper';
import { AuthService } from '../../core/services/auth.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const mockIsLoggedIn = signal<boolean>(false);

  const mockAuthService = {
    isLoggedIn: mockIsLoggedIn,
    logout: jest.fn(),
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]),
      { provide: AuthService, useValue: mockAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show LandingComponent when user is NOT logged in', () => {
    expect(getByTestId(fixture, 'app-landing')).toBeTruthy();
    expect(getByTestId(fixture, 'app-header')).toBeNull();
  });

  it('should show Header and RouterOutlet when user IS logged in', () => {
    mockIsLoggedIn.set(true);
    fixture.detectChanges();

    expect(getByTestId(fixture, 'app-header')).toBeTruthy();
    expect(getByTestId(fixture, 'app-landing')).toBeNull();
  });

  it('should call authService.logout when sidenav logout is clicked', () => {
    mockIsLoggedIn.set(true);
    fixture.detectChanges();

    const logoutBtn = getElementByTestId(fixture, 'sidenav-logout');
    logoutBtn.click();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should toggle sidenav when header emits toggleSidenav', () => {
    mockIsLoggedIn.set(true);
    fixture.detectChanges();

    const header = getByTestId(fixture, 'app-header');
    const sidenav = getByTestId(fixture, 'sidenav');

    const sidenavInstance = sidenav.componentInstance as MatSidenav;

    expect(sidenavInstance.opened).toBe(false);

    header.triggerEventHandler('toggleSidenav', null);
    fixture.detectChanges();

    expect(sidenavInstance.opened).toBe(true);
  });





});
