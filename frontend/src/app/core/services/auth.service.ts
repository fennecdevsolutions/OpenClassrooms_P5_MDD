import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private apiUrl = '/api/auth'
  private readonly tokenKey = "MDD_token"

  private tokenSignal = signal<string | null>(localStorage.getItem(this.tokenKey));

  // set log in state
  isLoggedIn = computed(() => {
    const token = this.tokenSignal();

    // clean up if token exists and is expired
    if (token && this.isTokenExpired(token)) {
      this.logout();
      return null;
    }

    // logged in if token exists and not expired
    return token;
  })


  public registerUser(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        tap(res => this.saveToken(res)));
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSignal.set(null);
  }

  // helper token management methods
  saveToken(authResponse: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResponse.token);
    this.tokenSignal.set(authResponse.token);
  }
  getToken(): string | null {
    return this.tokenSignal();
  }

  private isTokenExpired(token: string): boolean {
    try {
      // get the token payload
      const payloadBase64 = token.split('.')[1];
      // decode base64 to string and parse to JSON
      const payload = JSON.parse(atob(payloadBase64))
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      // if error then consider token expired
      return true;
    }
  }
}
