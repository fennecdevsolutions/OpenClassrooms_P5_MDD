import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/auth';
  const tokenKey = 'MDD_token';
  const createMockToken = (isExpired: boolean) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    // exp is in seconds: -1 hour if expired, +1 hour if valid
    const exp = isExpired ? now - 3600 : now + 3600;
    const payload = btoa(JSON.stringify({ sub: '123', exp }));
    return `${header}.${payload}.signature`;
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Login / Register', () => {
    const mockResponse: AuthResponse = { token: createMockToken(false) };

    it('should login and save the token', () => {
      const loginReq: LoginRequest = { identifier: 'test@test.com', password: 'password' };

      service.loginUser(loginReq).subscribe((res) => {
        expect(res.token).toEqual(mockResponse.token);
        expect(localStorage.getItem(tokenKey)).toBe(mockResponse.token);
        expect(service.getToken()).toBe(mockResponse.token);
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginReq);
      req.flush(mockResponse);
    });

    it('should register and save the token', () => {
      const regReq: RegisterRequest = { email: 'test@test.com', username: 'test', password: 'password' };

      service.registerUser(regReq).subscribe((res) => {
        expect(res.token).toEqual(mockResponse.token);
        expect(service.isLoggedIn()).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(regReq);
      req.flush(mockResponse);
    });
  });

  describe('Logout', () => {
    it('should remove token from storage and update signal', () => {
      const token = createMockToken(false);
      localStorage.setItem(tokenKey, token);

      service.logout();

      expect(localStorage.getItem(tokenKey)).toBeNull();
      expect(service.getToken()).toBeNull();
      expect(service.isLoggedIn()).toBeNull();
    });
  });

  describe('isLoggedIn (Signal Logic)', () => {
    const getServiceWithToken = (token: string) => {
      localStorage.setItem(tokenKey, token);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AuthService,
          provideHttpClient(),
          provideHttpClientTesting()
        ]
      });
      return TestBed.inject(AuthService);
    };

    it('should return null and logout if the token is expired', (done) => {
      const expiredToken = createMockToken(true);
      const service = getServiceWithToken(expiredToken);

      expect(service.isLoggedIn()).toBeNull();

      setTimeout(() => {
        expect(localStorage.getItem(tokenKey)).toBeNull();
        done();
      }, 2);
    });

    it('should return the token if it is valid', () => {
      const validToken = createMockToken(false);
      const validService = getServiceWithToken(validToken);

      expect(validService.isLoggedIn()).toBe(validToken);
    });
  });
});





