import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme } from '../models/theme.models';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private httpClient = inject(HttpClient);
  private apiUrl = '/api/themes'

  getAllThemes(): Observable<Theme[]> {
    return this.httpClient.get<Theme[]>(this.apiUrl);
  }

  subscribeTheme(themeId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/${themeId}/subscribe`, {})
  }

  getUserSubscriptions(): Observable<Theme[]> {
    return this.httpClient.get<Theme[]>(`${this.apiUrl}/subscriptions`);
  }
}
