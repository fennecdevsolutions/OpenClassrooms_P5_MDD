import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth.model';
import { User, UserProfileUpdateRequest } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/user'
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  getUserProfile(): Observable<User> {
    return this.httpClient.get<User>(this.apiUrl);
  }

  updateUserProfile(updateRequest: UserProfileUpdateRequest): Observable<AuthResponse> {
    return this.httpClient.put<AuthResponse>(this.apiUrl, updateRequest).pipe(
      tap((res) => {
        this.authService.saveToken(res);
      })
    );
  }

}
