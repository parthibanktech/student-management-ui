import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Enrollment, EnrollmentRequest } from '../models/enrollment.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

/**
 * ============================================================================================
 * ENROLLMENT SERVICE (FRONTEND)
 * ============================================================================================
 * This service handles all HTTP communication regarding student enrollments.
 * It uses Angular Signals for state management to ensure the UI updates reactively.
 *
 * KEY FEATURES:
 * - Load/Create/Delete Enrollments
 * - Filter by Student/Course
 * - Reactive State Management (Signal)
 */
@Injectable({
    providedIn: 'root'
})
export class EnrollmentService {
    private http = inject(HttpClient);
    // Base URL mapping to the API Gateway (/api/v1/enrollments via Nginx)
    private baseUrl = `${environment.apiUrl}/enrollments`;

    // SIGNAL: Holds the current list of enrollments.
    // Signals provide fine-grained reactivity and are the modern standard in Angular.
    private enrollmentsSignal = signal<Enrollment[]>([]);

    // Read-only public signal for components to consume
    enrollments = this.enrollmentsSignal.asReadonly();

    constructor() {
        this.loadEnrollments();
    }

    loadEnrollments(): void {
        this.getAllEnrollments().subscribe();
    }

    getAllEnrollments(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(this.baseUrl).pipe(
            tap(enrollments => {
                this.enrollmentsSignal.set(enrollments);
            }),
            catchError(err => {
                console.error('Error loading enrollments', err);
                throw err;
            })
        );
    }

    enrollStudent(request: EnrollmentRequest): Observable<Enrollment> {
        return this.http.post<Enrollment>(this.baseUrl, request).pipe(
            tap(() => {
                this.loadEnrollments();
            }),
            catchError(err => {
                console.error('Error enrolling student', err);
                throw err;
            })
        );
    }

    getEnrollmentsByStudent(studentId: number): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.baseUrl}/student/${studentId}`).pipe(
            tap(enrollments => {
                this.enrollmentsSignal.set(enrollments);
            }),
            catchError(err => {
                console.error('Error loading student enrollments', err);
                throw err;
            })
        );
    }

    getEnrollmentsByCourse(courseId: number): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.baseUrl}/course/${courseId}`).pipe(
            tap(enrollments => {
                this.enrollmentsSignal.set(enrollments);
            }),
            catchError(err => {
                console.error('Error loading course enrollments', err);
                throw err;
            })
        );
    }

    deleteEnrollment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            tap(() => {
                this.loadEnrollments();
            }),
            catchError(err => {
                console.error('Error deleting enrollment', err);
                throw err;
            })
        );
    }

    retryEnrollment(id: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${id}/retry`, {}).pipe(
            catchError(err => {
                console.error('Error retrying enrollment', err);
                throw err;
            })
        );
    }
}
