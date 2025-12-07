import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    constructor(private router: Router) { }

    private hasToken(): boolean {
        return !!localStorage.getItem('token');
    }

    login(username: string, password: string): Observable<boolean> {
        // Mock login - in real app, call backend API
        return of(true).pipe(
            delay(1000), // Simulate network delay
            tap(() => {
                localStorage.setItem('token', 'mock-jwt-token');
                this.isLoggedInSubject.next(true);
                this.router.navigate(['/dashboard']);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return this.hasToken();
    }
}
