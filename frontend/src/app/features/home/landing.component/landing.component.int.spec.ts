import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter, Router, RouterLink } from '@angular/router';
import { getByTestId } from '../../../../../utils/data-testid-helper';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let router: Router;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct link for login', () => {
    const loginDe = getByTestId(fixture, 'login-btn');
    const routerLink = loginDe.injector.get(RouterLink);
    expect((routerLink as any)._urlTree().toString()).toBe('/login');
  });

  it('should have the correct link for register', () => {
    const loginDe = getByTestId(fixture, 'register-btn');
    const routerLink = loginDe.injector.get(RouterLink);
    expect((routerLink as any)._urlTree().toString()).toBe('/register');
  });
});
