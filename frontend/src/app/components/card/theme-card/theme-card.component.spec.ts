import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemeCardComponent } from './theme-card.component';

describe('ThemeCardComponent', () => {
  let component: ThemeCardComponent;
  let fixture: ComponentFixture<ThemeCardComponent>;

  const mockThemeService = {
    subscribeTheme: jest.fn().mockReturnValue(of({})),
    unSubscribeTheme: jest.fn().mockReturnValue(of({})),
  };

  const mockSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeCardComponent],
      providers: [{ provide: ThemeService, useValue: mockThemeService },
      { provide: MatSnackBar, useValue: mockSnackBar }]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeCardComponent);
    fixture.componentRef.setInput('theme', {
      id: '1',
      title: 'Test Theme',
      description: 'Test description',
      isSubscribed: false,
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
