import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemeComponent } from './theme.component';

describe('ThemeComponent', () => {
  let component: ThemeComponent;
  let fixture: ComponentFixture<ThemeComponent>;

  const mockThemeService = {
    getAllThemes: jest.fn().mockReturnValue(of([])),
    getUserSubscriptions: jest.fn().mockReturnValue(of([])),
    unSubscribeTheme: jest.fn().mockReturnValue(of({})),
    subscribeTheme: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
