import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/courses`;

    private coursesSignal = signal<Course[]>([]);
    courses = this.coursesSignal.asReadonly();

    constructor() {
        this.loadCourses().subscribe();
    }

    loadCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(this.baseUrl).pipe(
            tap(courses => this.coursesSignal.set(courses)),
            catchError(err => {
                console.error('Error loading courses', err);
                throw err;
            })
        );
    }

    getCourseById(id: number): Observable<Course> {
        return this.http.get<Course>(`${this.baseUrl}/${id}`);
    }

    createCourse(course: Omit<Course, 'id'>): Observable<Course> {
        return this.http.post<Course>(this.baseUrl, course).pipe(
            tap(() => {
                this.loadCourses().subscribe();
            }),
            catchError(err => {
                console.error('Error adding course', err);
                throw err;
            })
        );
    }

    updateCourse(course: Course): Observable<Course> {
        return this.http.put<Course>(`${this.baseUrl}/${course.id}`, course).pipe(
            tap(() => {
                this.loadCourses().subscribe();
            }),
            catchError(err => {
                console.error('Error updating course', err);
                throw err;
            })
        );
    }

    deleteCourse(id: number): Observable<unknown> {
        return this.http.delete(`${this.baseUrl}/${id}`).pipe(
            tap(() => {
                this.loadCourses().subscribe();
            }),
            catchError(err => {
                console.error('Error deleting course', err);
                throw err;
            })
        );
    }
}
