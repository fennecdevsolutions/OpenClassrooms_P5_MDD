import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private apiUrl = '/api/auth'

  public registerUser(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest);
  }
}
