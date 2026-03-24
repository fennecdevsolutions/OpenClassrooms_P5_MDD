import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { UserService } from '../../../core/services/user.service';
import { MeComponent } from '../me/me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockUserService = {
    getUserProfile: jest.fn().mockReturnValue(of({ username: 'testUser', email: 'test@test.com' })),
    updateUserProfile: jest.fn().mockReturnValue(of({})),
  };

  const mockThemeService = {
    getAllThemes: jest.fn().mockReturnValue(of([])),
    getUserSubscriptions: jest.fn().mockReturnValue(of([])),
    unSubscribeTheme: jest.fn().mockReturnValue(of({})),
    subscribeTheme: jest.fn().mockReturnValue(of({})),
  };

  const mockSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
