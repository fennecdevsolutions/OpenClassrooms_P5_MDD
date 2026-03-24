import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthResponse } from '../models/auth.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  const apiUrl = '/api/user';
  const authServiceMock = { saveToken: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    //jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user profile data', () => {
    const mockUser: User = {
      username: 'Abdel_Dev',
      email: 'test@test.com',
    };

    service.getUserProfile().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should update user profile and trigger token update', () => {
    const updateReq = { username: 'NewName', email: 'new@test.com', password: '' };
    const mockAuthResponse: AuthResponse = { token: 'new-updated-token' };

    service.updateUserProfile(updateReq).subscribe((res) => {
      expect(res).toEqual(mockAuthResponse);

      expect(authService.saveToken).toHaveBeenCalledWith(mockAuthResponse);
      expect(authService.saveToken).toHaveBeenCalledTimes(1);

    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateReq);
    req.flush(mockAuthResponse);
  });
});
