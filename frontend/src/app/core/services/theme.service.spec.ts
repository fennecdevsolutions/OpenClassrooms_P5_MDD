import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Theme } from '../models/theme.models';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/themes';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ThemeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all themes', () => {
    const mockThemes: Theme[] = [
      { id: '1', title: 'Angular', description: 'Framework' },
      { id: '2', title: 'Java', description: 'Backend' }
    ];

    service.getAllThemes().subscribe((themes) => {
      expect(themes.length).toBe(2);
      expect(themes).toEqual(mockThemes);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockThemes);
  });

  it('should subscribe to a theme', () => {
    const themeId = '10';

    service.subscribeTheme(themeId).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${themeId}/subscribe`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('should unsubscribe from a theme', () => {
    const themeId = '10';

    service.unSubscribeTheme(themeId).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${themeId}/unsubscribe`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch user subscriptions', () => {
    const mockSubs: Theme[] = [{ id: '1', title: 'Angular', description: 'Framework' }];

    service.getUserSubscriptions().subscribe((subs) => {
      expect(subs).toEqual(mockSubs);
    });

    const req = httpMock.expectOne(`${apiUrl}/subscriptions`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSubs);
  });
});
