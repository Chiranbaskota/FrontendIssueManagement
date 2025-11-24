import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private credentialsSignal = signal<string | null>(null);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const credentials = btoa(`${request.username}:${request.password}`);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`
    });

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      {},
      { headers }
    ).pipe(
      tap(response => {
        this.currentUserSignal.set(response.user);
        this.credentialsSignal.set(credentials);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('credentials', credentials);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.credentialsSignal.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('credentials');
    this.router.navigate(['/auth/login']);
  }

  getCredentials(): string | null {
    return this.credentialsSignal();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    const credentials = localStorage.getItem('credentials');

    if (userJson && credentials) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSignal.set(user);
        this.credentialsSignal.set(credentials);
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        this.logout();
      }
    }
  }
}
