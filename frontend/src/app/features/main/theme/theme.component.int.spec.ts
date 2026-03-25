import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { getAllByTestId } from '../../../../../utils/data-testid-helper';
import { ThemeCardComponent } from '../../../components/card/theme-card/theme-card.component';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemeComponent } from './theme.component';

describe('ThemeComponent', () => {
  let component: ThemeComponent;
  let fixture: ComponentFixture<ThemeComponent>;

  const mockAllThemes = [
    { id: '1', title: 'Angular', description: 'Web framework' },
    { id: '2', title: 'Java', description: 'Backend language' },
    { id: '3', title: 'Docker', description: 'Containers' },
  ];

  const mockSubscribedThemes = [
    { id: '1', title: 'Angular' }
  ];

  const mockThemeService = {
    getAllThemes: jest.fn().mockReturnValue(of(mockAllThemes)),
    getUserSubscriptions: jest.fn().mockReturnValue(of(mockSubscribedThemes)),
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

  it('should combine all themes and subscriptions to set isSubscribed state', (done) => {
    component.themes$.subscribe(themes => {
      expect(themes.length).toBe(3);

      // mock user is subscribed only to angular theme
      const angularTheme = themes.find(t => t.id === '1');
      expect(angularTheme?.isSubscribed).toBe(true);

      const javaTheme = themes.find(t => t.id === '2');
      expect(javaTheme?.isSubscribed).toBe(false);

      done();
    });
  });

  it('should render correct number of theme cards and pass correct data to them', () => {
    const cards = getAllByTestId(fixture, "theme-card");
    expect(cards.length).toBe(3);
    fixture.detectChanges();
    const firstCardComponent = cards[0].componentInstance as ThemeCardComponent;
    expect(firstCardComponent.theme().id).toBe('1');
    expect(firstCardComponent.theme().title).toBe('Angular');
    expect(firstCardComponent.theme().isSubscribed).toBe(true);

    const secondCardComponent = cards[1].componentInstance as ThemeCardComponent;
    expect(secondCardComponent.theme().id).toBe('2');
    expect(secondCardComponent.theme().title).toBe('Java');
    expect(secondCardComponent.theme().isSubscribed).toBe(false);
  });



});
